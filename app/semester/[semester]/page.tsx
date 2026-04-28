import { getSubjects } from "@/lib/getSubjects";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ChevronRight, Clock, TrendingUp } from "lucide-react";

export default async function SemesterPage({
  params,
}: {
  params: Promise<{ semester: string }>;
}) {
  const { semester } = await params;
  
  const semesterNumber = Number(semester);
  if (isNaN(semesterNumber) || semesterNumber < 1 || semesterNumber > 8) {
    notFound();
  }

  const subjects = await getSubjects(semesterNumber);
  
  if (!subjects || subjects.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/semester" className="hover:text-blue-600">Semester</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Semester {semesterNumber}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Semester {semesterNumber}
              </h1>
              <p className="text-gray-600">
                {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="flex gap-3 text-sm">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                <span className="text-gray-500">Credits</span>
                <p className="font-semibold text-gray-900">24</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                <span className="text-gray-500">Duration</span>
                <p className="font-semibold text-gray-900">6 Months</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <BookOpen className="w-5 h-5 text-blue-600 mb-2" />
            <p className="text-sm text-gray-500">Core Subjects</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.ceil(subjects.length * 0.7)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <TrendingUp className="w-5 h-5 text-green-600 mb-2" />
            <p className="text-sm text-gray-500">Electives</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.floor(subjects.length * 0.3)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <Clock className="w-5 h-5 text-purple-600 mb-2" />
            <p className="text-sm text-gray-500">Total Hours</p>
            <p className="text-2xl font-bold text-gray-900">180</p>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Link
                key={subject}
                href={`/semester/${semesterNumber}/${encodeURIComponent(subject)}`}
                className="group bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 capitalize px-2 py-1 bg-gray-100 rounded">
                    {subject.includes('lab') ? 'Lab' : 'Theory'}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1 capitalize line-clamp-1">
                  {subject.replace(/-/g, ' ')}
                </h3>
                
                <p className="text-sm text-gray-500 mb-3">
                  4 Credits • 12 Modules
                </p>
                
                <div className="flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Your Progress</h2>
              <p className="text-sm text-gray-500">Track your learning journey</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs text-white">
                    {i}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-500">+{subjects.length - 3} more</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-blue-600 rounded-full" />
            </div>
            <p className="text-xs text-gray-500 mt-2">33% complete</p>
          </div>
        </div>

        {/* Semester Navigation */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Other Semesters</h3>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <Link
                key={sem}
                href={`/semester/${sem}`}
                className={`px-3 py-1.5 text-sm rounded-md transition-all
                  ${sem === semesterNumber
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600'}`}
              >
                Sem {sem}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}