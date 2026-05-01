import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as contentful from "contentful-management";
import sanitizeHtml from "sanitize-html";
import { parse } from "node-html-parser";

// ===== HTML CLEANER (REMOVES WORD GARBAGE) =====
function cleanHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "h1", "h2", "h3",
      "p", "b", "strong", "i", "em",
      "ul", "ol", "li",
      "br"
    ],
    allowedAttributes: {},
  });
}

// ===== HTML → CONTENTFUL RICH TEXT =====
function htmlToRichText(html: string) {
  const { parse } = require("node-html-parser");
  const root = parse(html);

  function parseInline(node: any): any[] {
    if (node.nodeType === 3) {
      const value = node.rawText.replace(/\n/g, " ").trim();
      if (!value) return [];

      return [
        {
          nodeType: "text",
          value,
          marks: [],
          data: {},
        },
      ];
    }

    const tag = node.tagName;

    // BOLD
    if (tag === "B" || tag === "STRONG") {
      return [
        {
          nodeType: "text",
          value: node.text,
          marks: [{ type: "bold" }],
          data: {},
        },
      ];
    }

    // ITALIC
    if (tag === "I" || tag === "EM") {
      return [
        {
          nodeType: "text",
          value: node.text,
          marks: [{ type: "italic" }],
          data: {},
        },
      ];
    }

    // RECURSE INLINE
    return node.childNodes.flatMap(parseInline);
  }

  function parseBlock(node: any): any | null {
    if (node.nodeType === 3) return null;

    const tag = node.tagName;

    // HEADINGS
    if (["H1", "H2", "H3"].includes(tag)) {
      return {
        nodeType: tag.toLowerCase(),
        data: {},
        content: node.childNodes.flatMap(parseInline),
      };
    }

    // PARAGRAPH
    if (tag === "P") {
      const content = node.childNodes.flatMap(parseInline);

      if (content.length === 0) return null;

      return {
        nodeType: "paragraph",
        data: {},
        content,
      };
    }

    // LIST
    if (tag === "UL" || tag === "OL") {
      return {
        nodeType: tag === "UL" ? "unordered-list" : "ordered-list",
        data: {},
        content: node.childNodes
          .map((li: any) => {
            if (li.tagName !== "LI") return null;

            return {
              nodeType: "list-item",
              data: {},
              content: [
                {
                  nodeType: "paragraph",
                  data: {},
                  content: li.childNodes.flatMap(parseInline),
                },
              ],
            };
          })
          .filter(Boolean),
      };
    }

    return null;
  }

  return {
    nodeType: "document",
    data: {},
    content: root.childNodes.map(parseBlock).filter(Boolean),
  };
}


export async function POST(req: Request) {
  try {
    // ===== AUTH =====
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // ===== ENV =====
    const token = process.env.NEXT_PUBLIC_CONTENTFUL_MANAGEMENT_TOKEN;
    const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;

    if (!token || !spaceId) {
      return NextResponse.json(
        { message: "Missing Contentful config" },
        { status: 500 }
      );
    }

    const client = contentful.createClient({ accessToken: token });
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment("master");

    const contentTypeHeader = req.headers.get("content-type") || "";

    let semester!: number;
    let subject!: string;
    let topic!: string;
    let contentType!: string;

    let richContent: any = null;
    let plainText: string | null = null;
    let fileAssetId: string | null = null;

    // ===== FILE UPLOAD =====
    if (contentTypeHeader.includes("multipart/form-data")) {
      const formData = await req.formData();

      semester = Number(formData.get("semester"));
      subject = String(formData.get("subject"));
      topic = String(formData.get("topic"));
      contentType = String(formData.get("contentType"));

      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json({ message: "File missing" }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();

      let asset = await environment.createAssetFromFiles({
        fields: {
          title: { "en-US": file.name },
          file: {
            "en-US": {
              contentType: file.type,
              fileName: file.name,
              file: arrayBuffer,
            },
          },
          description: {}
        },
      });

      await asset.processForAllLocales();
      asset = await environment.getAsset(asset.sys.id);
      await asset.publish();

      fileAssetId = asset.sys.id;
    } else {
      // ===== JSON BODY =====
      const body = await req.json();

      semester = Number(body.semester);
      subject = body.subject;
      topic = body.topic;
      contentType = body.contentType;

      plainText = body.plainText || null;

      // 👉 HTML FROM WORD PASTE
      if (body.html) {
        const cleaned = cleanHtml(body.html);
        richContent = htmlToRichText(cleaned);
      }
    }

    // ===== VALIDATION =====
    if (!semester || !subject || !topic || !contentType) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ===== BUILD FIELDS =====
    const fields: any = {
      semester: { "en-US": semester },
      subject: { "en-US": subject },
      topic: { "en-US": topic },
      contentType: { "en-US": contentType },
    };

    if (contentType === "richtext") {
      if (!richContent && plainText) {
        richContent = htmlToRichText(`<p>${plainText}</p>`);
      }

      if (!richContent) {
        return NextResponse.json(
          { message: "No content provided" },
          { status: 400 }
        );
      }

      fields.richContent = { "en-US": richContent };
    }

    if (contentType === "text" && plainText) {
      fields.plainText = { "en-US": plainText };
    }

    if ((contentType === "pdf" || contentType === "doc") && fileAssetId) {
      fields.file = {
        "en-US": {
          sys: {
            type: "Link",
            linkType: "Asset",
            id: fileAssetId,
          },
        },
      };
    }

    // ===== CREATE ENTRY =====
    let entry = await environment.createEntry("hamrobit", { fields });
    entry = await entry.publish();

    return NextResponse.json({
      message: "Uploaded successfully",
      entryId: entry.sys.id,
      fileAssetId,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
