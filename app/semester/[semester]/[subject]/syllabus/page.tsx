"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, notFound } from "next/navigation";
import Image from "next/image";
import { contentfulClient } from "@/lib/contentful";
import { 
  BookOpen, 
  FileText, 
  HelpCircle, 
  ChevronRight,
  Loader2,
  Download,
  ExternalLink,
  Image as ImageIcon,
  File as FileIcon,
  Calendar
} from "lucide-react";

export default function Page(props: any) {
  const params = use(props.params);
  const semester = Number(params.semester);
  const subject = decodeURIComponent(params.subject);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();

  // validate semester
  useEffect(() => {
    if (isNaN(semester) || semester < 1 || semester > 8) {
      notFound();
    }
  }, [semester]);

  // fetch syllabus
  useEffect(() => {
    async function load() {
      try {
        const res = await contentfulClient.getEntries({
          content_type: "syllabus",
          "fields.semester": semester,
          "fields.subject": subject,
          include: 2,
        });

        setData(res.items || []);
      } catch (err) {
        console.error("Error fetching syllabus:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [semester, subject]);

  const nav = [
    { label: "Chapters", href: `/semester/${semester}/${subject}`, icon: BookOpen },
    { label: "Syllabus", href: `/semester/${semester}/${subject}/syllabus`, icon: FileText },
    { label: "Questions", href: `/semester/${semester}/${subject}/questions`, icon: HelpCircle },
  ];

  // asset resolver
  const getAsset = (asset: any) => {
    if (!asset) return null;

    if (asset.fields?.file) {
      return {
        url: asset.fields.file.url?.startsWith("//")
          ? `https:${asset.fields.file.url}`
          : asset.fields.file.url,
        type: asset.fields.file.contentType || "",
        name: asset.fields.title || "file",
      };
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER with Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/semester/${semester}`} className="hover:text-gray-900 transition-colors">
              Semester {semester}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{subject}</span>
          </div>
          
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {subject} - Syllabus
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Semester {semester}
              </p>
            </div>
          </div>
        </div>

        {/* NAV with Icons */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex gap-1">
            {nav.map((n) => {
              const Icon = n.icon;
              const isActive = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all duration-200
                    ${isActive 
                      ? "bg-white text-gray-900 border border-b-white border-gray-200 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
            <p className="mt-4 text-gray-500">Loading syllabus...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-red-500 text-lg">No syllabus found.</p>
            <p className="text-gray-400 mt-2">Please check back later</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((s, i) => {
              const image = getAsset(s.fields?.image);
              const pdf = getAsset(s.fields?.pdf);

              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Card Header */}
                  <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-600" />
                      Syllabus Details
                    </h2>
                  </div>

                  <div className="p-6 space-y-8">
                    {/* TEXT */}
                    {s.fields?.syllabusText && (
                      <div className="prose prose-gray max-w-none">
                        <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {s.fields.syllabusText}
                        </div>
                      </div>
                    )}

                    {/* IMAGE */}
                    {image && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-blue-600" />
                          Image Attachment
                        </h3>
                        <div className="relative group">
                          <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <Image
                              src={image.url}
                              alt={image.name}
                              width={1200}
                              height={700}
                              className="w-full h-auto object-contain max-h-[500px]"
                            />
                          </div>
                          <div className="mt-4">
                            <a
                              href={image.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Open Image
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PDF */}
                    {pdf && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <FileIcon className="w-5 h-5 text-green-600" />
                          PDF Document
                        </h3>

                        <div className="flex gap-3">
                          <a
                            href={pdf.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open PDF
                          </a>

                          <a
                            href={pdf.url}
                            download
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download PDF
                          </a>
                        </div>

                        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                          <iframe
                            src={pdf.url}
                            className="w-full h-[700px]"
                            title="PDF Viewer"
                          />
                        </div>
                      </div>
                    )}

                    {/* fallback */}
                    {!image && !pdf && s.fields?.syllabusText && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <p className="text-sm text-blue-700">
                          No image or PDF attachments available for this syllabus.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .space-y-6 > * {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}