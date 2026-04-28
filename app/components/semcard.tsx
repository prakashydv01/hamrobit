"use client";

import Link from "next/link";
import { BookOpen, ChevronRight, GraduationCap, Library, FileText } from "lucide-react";

const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Fixed white background wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        
        {/* Hero Section with Gradient */}
        <section className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-6">
            <GraduationCap className="w-6 h-6 text-blue-600" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            BIT Learning Portal
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive learning hub for all semesters. Access notes, 
            previous year questions, and syllabus in one place.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Library className="w-5 h-5 text-blue-500" />
              <span>8 Semesters</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FileText className="w-5 h-5 text-blue-500" />
              <span>100+ Resources</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span>Updated Content</span>
            </div>
          </div>
        </section>

        {/* Semester Cards Section */}
        <section>
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Choose Your Semester
            </h2>
            <p className="text-gray-600">
              Select a semester to access relevant study materials
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {semesters.map((sem) => (
              <Link
                key={sem}
                href={`/semester/${sem}`}
                className="group relative bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-200 
                         shadow-sm hover:shadow-xl p-6 sm:p-8 text-center transition-all duration-300 
                         hover:-translate-y-1"
              >
                {/* Decorative gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-500 
                                rounded-xl flex items-center justify-center shadow-lg 
                                group-hover:shadow-xl transition-shadow duration-300">
                    <span className="text-2xl font-bold text-white">
                      {sem}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">
                    Semester {sem}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    {sem === 1 || sem === 2 ? 'Foundation Courses' :
                     sem === 3 || sem === 4 ? 'Core Subjects' :
                     sem === 5 || sem === 6 ? 'Specialization' : 'Advanced Topics'}
                  </p>
                  
                  <div className="flex items-center justify-center text-blue-600 font-medium text-sm
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Browse Resources</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-16 sm:mt-20 lg:mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Everything You Need to Succeed
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: "Lecture Notes",
                description: "Comprehensive notes for all subjects, curated by top performers"
              },
              {
                icon: <FileText className="w-6 h-6" />,
                title: "Previous Year Questions",
                description: "Access past exam papers with solutions for better preparation"
              },
              {
                icon: <Library className="w-6 h-6" />,
                title: "Syllabus & Resources",
                description: "Complete syllabus breakdown and additional learning materials"
              }
            ].map((feature, index) => (
              <div key={index} 
                   className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm
                            hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center 
                              text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 sm:mt-20 lg:mt-24 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Join thousands of BIT students who are already using our platform 
              to excel in their studies.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold
                             hover:shadow-lg hover:scale-105 transition-all duration-300">
              Explore All Resources
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}