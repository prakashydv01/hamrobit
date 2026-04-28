import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as contentful from "contentful-management";

export async function POST(req: Request) {
  try {
    // ===== AUTH CHECK =====
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // ===== ENV CHECK =====
    const managementToken = process.env.NEXT_PUBLIC_CONTENTFUL_MANAGEMENT_TOKEN;
    const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;

    if (!managementToken || !spaceId) {
      return NextResponse.json(
        { message: "Contentful environment variables missing" },
        { status: 500 }
      );
    }

    // ===== INIT CONTENTFUL =====
    const client = contentful.createClient({ accessToken: managementToken });
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment("master");

    // ===== GET FORM DATA =====
    const formData = await req.formData();

    const semester = Number(formData.get("semester"));
    const subject = formData.get("subject") as string;
    const file = formData.get("file") as File;

    // ===== VALIDATION =====
    if (!semester || !subject || !file) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { message: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // ===== CONVERT FILE =====
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ===== CREATE UPLOAD =====
    const upload = await environment.createUpload({
      file: buffer,
    });

    // ===== CREATE ASSET =====
    const asset = await environment.createAsset({
      fields: {
        title: { "en-US": file.name },
        file: {
          "en-US": {
            contentType: file.type,
            fileName: file.name,
            uploadFrom: {
              sys: {
                type: "Link",
                linkType: "Upload",
                id: upload.sys.id,
              },
            },
          },
        },
      },
    });

    // ===== PROCESS ASSET =====
    await asset.processForAllLocales();

    // ✅ WAIT UNTIL PROCESSING IS COMPLETE
    let processedAsset = await environment.getAsset(asset.sys.id);
    let retries = 10;

    while (
      !processedAsset.fields.file["en-US"].url &&
      retries > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      processedAsset = await environment.getAsset(asset.sys.id);
      retries--;
    }

    if (!processedAsset.fields.file["en-US"].url) {
      return NextResponse.json(
        { message: "Asset processing timeout" },
        { status: 500 }
      );
    }

    // ✅ ALWAYS USE LATEST VERSION BEFORE PUBLISH
    const latestAsset = await environment.getAsset(asset.sys.id);
    const publishedAsset = await latestAsset.publish();

    // ===== CREATE ENTRY =====
    const entry = await environment.createEntry("modelquestion", {
      fields: {
        semester: { "en-US": semester },
        subject: { "en-US": subject },
        pdf: {
          "en-US": {
            sys: {
              type: "Link",
              linkType: "Asset",
              id: publishedAsset.sys.id,
            },
          },
        },
      },
    });

    await entry.publish();

    return NextResponse.json({
      message: "PDF uploaded successfully",
      entryId: entry.sys.id,
      assetId: publishedAsset.sys.id,
      fileUrl: `https:${processedAsset.fields.file["en-US"].url}`,
    });

  } catch (error: any) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        message: "Upload failed",
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
