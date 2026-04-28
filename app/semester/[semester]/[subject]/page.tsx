"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, notFound } from "next/navigation";
import { contentfulClient } from "@/lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { 
  BookOpen, 
  FileText, 
  HelpCircle, 
  ArrowLeft, 
  Download, 
  ExternalLink,
  ChevronRight,
  Loader2,
  File,
  Image as ImageIcon,
  FileText as FileTextIcon,
  Search,
  Grid,
  List,
  Maximize2,
  Minimize2
} from "lucide-react";

export default function Page(props: any) {
  const params = use(props.params);
  const semester = Number(params.semester);
  const subject = decodeURIComponent(params.subject);

  const [chapters, setChapters] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (isNaN(semester) || semester < 1 || semester > 8) {
      notFound();
    }
  }, [semester]);

  useEffect(() => {
    async function load() {
      try {
        const res = await contentfulClient.getEntries({
          content_type: "hamrobit",
          "fields.semester": semester,
          "fields.subject": subject,
          order: "sys.createdAt",
        });
        setChapters(res.items);
      } catch (error) {
        console.error("Failed to load chapters:", error);
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

  const filteredChapters = chapters.filter(chapter =>
    chapter.fields.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.fields.contentType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFile = (chapter: any) => {
    const file = chapter.fields.file?.fields?.file;
    if (!file) return null;

    return {
      url: file.url ? "https:" + file.url : "",
      type: file.contentType || "",
      name: file.fileName || "file",
    };
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileTextIcon className="w-5 h-5" />;
    if (type.includes("image")) return <ImageIcon className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-slideDown">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-900 transition-colors flex items-center gap-1">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/semester/${semester}`} className="hover:text-gray-900 transition-colors">
              Semester {semester}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{subject}</span>
          </div>
          
          <div className="flex justify-between items-end flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                {subject}
              </h1>
              <p className="text-gray-500 mt-2">Semester {semester} • Complete Study Material</p>
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-all"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
            {nav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-t-lg transition-all duration-200 whitespace-nowrap
                    ${isActive 
                      ? "bg-white text-gray-900 border border-b-white border-gray-200 shadow-sm font-medium" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-t-blue-600 rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-gray-500 font-medium">Loading chapters...</p>
          </div>
        )}

        {/* List View */}
        {!loading && !selected && (
          <>
            {/* Search and View Controls */}
            {chapters.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search chapters by topic or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  />
                </div>
                <div className="flex gap-2 bg-white rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {filteredChapters.length === 0 ? (
              <div className="text-center py-32">
                <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-xl font-medium">
                  {chapters.length === 0 ? "No chapters found" : "No matching chapters"}
                </p>
                {searchTerm && chapters.length > 0 && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {filteredChapters.map((c, i) => (
                  <div
                    key={c.sys.id}
                    onClick={() => setSelected(c)}
                    className="group bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-gray-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      {c.fields.contentType && (
                        <span className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600 font-medium">
                          {c.fields.contentType}
                        </span>
                      )}
                    </div>
                    <h2 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg">
                      {c.fields.topic}
                    </h2>
                    <div className="flex items-center text-sm text-gray-400 mt-4 group-hover:text-gray-600 transition-colors">
                      <span>View details</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Detail View */}
        {selected && (
          <div className="animate-fadeIn">
            {/* Back Button */}
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-gray-900 transition-all mb-6 group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to chapters
            </button>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
              {/* Header */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-slate-50 to-white p-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  {selected.fields.topic}
                </h2>
                {selected.fields.contentType && (
                  <div className="mt-3">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-50 text-blue-700 font-medium">
                      {selected.fields.contentType}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Rich Text Content */}
                {selected.fields.richContent && (
                  <div className="prose prose-slate max-w-none">
                    {documentToReactComponents(selected.fields.richContent)}
                  </div>
                )}

                {/* Plain Text Content */}
                {selected.fields.plainText && (
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                      {selected.fields.plainText}
                    </div>
                  </div>
                )}

                {/* File Attachments */}
                {(() => {
                  const file = getFile(selected);
                  if (!file) return null;

                  return (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        {getFileIcon(file.type)}
                        <span className="text-sm text-gray-700 font-medium">{file.name}</span>
                      </div>
                      <div className="flex gap-3">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all transform hover:scale-105"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open
                        </a>
                        <a
                          href={file.url}
                          download
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </div>

                      {/* PDF Preview */}
                      {file.type.includes("pdf") && (
                        <div className="mt-5 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                            <p className="text-xs text-gray-600 font-medium">Preview</p>
                          </div>
                          <iframe
                            src={file.url}
                            className="w-full h-[600px]"
                            title="PDF Preview"
                          />
                        </div>
                      )}

                      {/* Image Preview */}
                      {file.type.includes("image") && (
                        <div className="mt-5 rounded-xl overflow-hidden border border-gray-200">
                          <img
                            src={file.url}
                            alt={file.name}
                            className="max-w-full rounded-xl shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* No Content Fallback */}
                {!selected.fields.richContent &&
                  !selected.fields.plainText &&
                  !selected.fields.file && (
                    <div className="text-center py-16 bg-gray-50 rounded-xl">
                      <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No content available for this chapter</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}