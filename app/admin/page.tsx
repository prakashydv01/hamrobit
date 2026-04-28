"use client";

import { useState } from "react";
import { 
  FileText, 
  BookOpen, 
  Upload, 
  Loader2, 
  CheckCircle2,
  XCircle,
  File,
  FileJson,
  Type,
  FileDigit,
  GraduationCap,
  BookMarked,
  Hash
} from "lucide-react";

export default function UploadPage() {
  const [mode, setMode] = useState("notes");

  const [semester, setSemester] = useState("1");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");

  const [contentType, setContentType] = useState("richtext");

  const [htmlContent, setHtmlContent] = useState("");
  const [plainText, setPlainText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [modelPdf, setModelPdf] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const resetForm = () => {
    setSubject("");
    setTopic("");
    setPlainText("");
    setHtmlContent("");
    setFile(null);
    setModelPdf(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      if (mode === "model") {
        if (!modelPdf) {
          setMessage("Please upload a PDF file");
          setMessageType("error");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("semester", semester);
        formData.append("subject", subject);
        formData.append("file", modelPdf);

        const res = await fetch("/api/admin/upload-model-questions", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setMessage(data.message);
        setMessageType(data.message?.toLowerCase().includes("success") ? "success" : "error");
        resetForm();
      } else {
        if (contentType === "pdf" || contentType === "doc") {
          const formData = new FormData();
          formData.append("semester", semester);
          formData.append("subject", subject);
          formData.append("topic", topic);
          formData.append("contentType", contentType);

          if (file) formData.append("file", file);

          const res = await fetch("/api/admin/upload-note", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          setMessage(data.message);
          setMessageType(data.message?.toLowerCase().includes("success") ? "success" : "error");
          resetForm();
        } else {
          const res = await fetch("/api/admin/upload-note", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              semester: Number(semester),
              subject,
              topic,
              contentType,
              html: htmlContent,
              plainText,
            }),
          });

          const data = await res.json();
          setMessage(data.message);
          setMessageType(data.message?.toLowerCase().includes("success") ? "success" : "error");
          resetForm();
        }
      }
    } catch (err) {
      setMessage("Upload failed");
      setMessageType("error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Content Upload</h1>
          <p className="text-gray-600">Upload notes or model question papers for students</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Mode Toggle */}
            <div className="mb-8">
              <div className="flex gap-3 p-1 bg-gray-100 rounded-xl">
                <button
                  onClick={() => setMode("notes")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    mode === "notes"
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  Notes
                </button>
                <button
                  onClick={() => setMode("model")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    mode === "model"
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  Model Papers
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Semester Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Select Semester
                  </div>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <button
                      key={sem}
                      onClick={() => setSemester(sem.toString())}
                      className={`py-2 rounded-lg font-medium transition-all duration-200 ${
                        semester === sem.toString()
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <BookMarked className="w-4 h-4" />
                    Subject
                  </div>
                </label>
                <input
                  placeholder="e.g., Mathematics, Physics, Data Structures..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              {/* Model Papers Section */}
              {mode === "model" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4" />
                      Upload PDF
                    </div>
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 transition-colors">
                    <div className="space-y-1 text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="application/pdf"
                            onChange={(e) => setModelPdf(e.target.files?.[0] || null)}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF up to 10MB</p>
                      {modelPdf && (
                        <div className="mt-2 text-sm text-green-600 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          {modelPdf.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes Section */}
              {mode === "notes" && (
                <>
                  {/* Topic Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Topic
                      </div>
                    </label>
                    <input
                      placeholder="e.g., Introduction to Algorithms, Chapter 1..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>

                  {/* Content Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Content Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { value: "richtext", label: "Rich Text", icon: FileJson },
                        { value: "text", label: "Plain Text", icon: Type },
                        { value: "pdf", label: "PDF", icon: FileText },
                        { value: "doc", label: "Document", icon: FileDigit },
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => setContentType(value)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                            contentType === value
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300 text-gray-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm font-medium">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rich Text Editor */}
                  {contentType === "richtext" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Content (Copy from Word)
                      </label>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div
                          contentEditable
                          className="min-h-[250px] p-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent prose max-w-none"
                          onPaste={(e) => {
                            const html = e.clipboardData.getData("text/html");
                            if (html) setHtmlContent(html);
                          }}
                          onInput={(e) => {
                            setHtmlContent(e.currentTarget.innerHTML);
                          }}
                          dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Tip: Copy content from Word and paste here
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Plain Text Editor */}
                  {contentType === "text" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                        rows={8}
                        placeholder="Enter your content here..."
                        value={plainText}
                        onChange={(e) => setPlainText(e.target.value)}
                      />
                    </div>
                  )}

                  {/* File Upload for PDF/DOC */}
                  {(contentType === "pdf" || contentType === "doc") && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Upload {contentType.toUpperCase()} File
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 transition-colors">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                              <span>Upload a file</span>
                              <input
                                type="file"
                                className="sr-only"
                                accept={contentType === "pdf" ? ".pdf" : ".doc,.docx"}
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {contentType === "pdf" ? "PDF" : "Word document"} up to 10MB
                          </p>
                          {file && (
                            <div className="mt-2 text-sm text-green-600 flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              {file.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Content
                  </span>
                )}
              </button>

              {/* Message Display */}
              {message && (
                <div className={`p-4 rounded-xl flex items-start gap-3 ${
                  messageType === "success" 
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : messageType === "error"
                    ? "bg-red-50 border border-red-200 text-red-800"
                    : "bg-blue-50 border border-blue-200 text-blue-800"
                }`}>
                  {messageType === "success" ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : messageType === "error" ? (
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Upload className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm">{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}