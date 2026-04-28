"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSemester, setOpenSemester] = useState(false);
  const [openEntrance, setOpenEntrance] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const semesterRef = useRef<HTMLDivElement>(null);
  const entranceRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
      if (semesterRef.current && !semesterRef.current.contains(event.target as Node)) {
        setOpenSemester(false);
      }
      if (entranceRef.current && !entranceRef.current.contains(event.target as Node)) {
        setOpenEntrance(false);
      }
    }

    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close other dropdown when one opens
  const handleSemesterHover = () => {
    setOpenEntrance(false);
    setOpenSemester(true);
  };

  const handleEntranceHover = () => {
    setOpenSemester(false);
    setOpenEntrance(true);
  };

  const handleSemesterClick = (semesterNumber: number) => {
    setOpenSemester(false);
    router.push(`/semester/${semesterNumber}`);
  };

  const semesters = [
    { number: 1, name: "First Semester" },
    { number: 2, name: "Second Semester" },
    { number: 3, name: "Third Semester" },
    { number: 4, name: "Fourth Semester" },
    { number: 5, name: "Fifth Semester" },
    { number: 6, name: "Sixth Semester" },
    { number: 7, name: "Seventh Semester" },
    { number: 8, name: "Eighth Semester" },
  ];

  return (
    <header
      className={`
        sticky top-0 z-50 transition-all duration-200 px-4 md:px-6 py-2
        ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200"
            : "bg-white border-b border-gray-200"
        }
      `}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            BIT Portal
          </span>
          <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
            v2.0
          </span>
        </Link>

        {/* Navigation with Hover Dropdowns - Always visible */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Semester Dropdown */}
          <div className="relative" ref={semesterRef}>
            <button
              onMouseEnter={handleSemesterHover}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-all duration-200 font-medium flex items-center gap-1"
            >
              Semester
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${openSemester ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openSemester && (
              <div 
                className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                onMouseLeave={() => setOpenSemester(false)}
              >
                <div className="px-3 pb-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Semester</p>
                </div>
                <div className="space-y-0.5">
                  {semesters.map((sem) => (
                    <button
                      key={sem.number}
                      onClick={() => handleSemesterClick(sem.number)}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group"
                    >
                      <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-xs font-semibold text-gray-600 group-hover:bg-gray-200 mr-3">
                        {sem.number}
                      </span>
                      <span className="font-medium">{sem.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Entrance Dropdown */}
          <div className="relative" ref={entranceRef}>
            <button
              onMouseEnter={handleEntranceHover}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-all duration-200 font-medium flex items-center gap-1"
            >
              Entrance
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${openEntrance ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openEntrance && (
              <div 
                className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                onMouseLeave={() => setOpenEntrance(false)}
              >
                <div className="px-3 pb-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preparation</p>
                </div>
                <a
  href="https://www.hamroexam.com/mocktest"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group"
  onClick={() => setOpenEntrance(false)}
>
  <div className="w-8 h-8 flex items-center justify-center bg-blue-50 rounded-full mr-3 group-hover:bg-blue-100">
    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2-10H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
    </svg>
  </div>
  <div>
    <p className="font-medium">Mock Test</p>
    <p className="text-xs text-gray-500">Practice with timed tests</p>
  </div>
</a>
                <a
  href="https://www.hamroexam.com/modelquestion"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group"
  onClick={() => setOpenEntrance(false)}
>
  <div className="w-8 h-8 flex items-center justify-center bg-green-50 rounded-full mr-3 group-hover:bg-green-100">
    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  </div>
  <div>
    <p className="font-medium">Model Question</p>
    <p className="text-xs text-gray-500">Previous year questions</p>
  </div>
</a>
              </div>
            )}
          </div>

          <Link
            href="/questions"
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Questions
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="relative" ref={dropdownRef}>
          {!session ? (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-md font-medium transition-all duration-200"
              >
                Get started
              </Link>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-gray-50 transition-all duration-200"
              >
                <div className="w-7 h-7 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {session.user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="hidden sm:block text-xs font-medium text-gray-700">
                  {session.user?.name?.split(" ")[0]}
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-gray-500 transition-all duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {session.user?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="md:hidden border-t border-gray-100">
                    <div className="py-2">
                      <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Semester
                      </p>
                      {semesters.map((sem) => (
                        <button
                          key={sem.number}
                          onClick={() => {
                            setOpen(false);
                            handleSemesterClick(sem.number);
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs mr-3">
                            {sem.number}
                          </span>
                          {sem.name}
                        </button>
                      ))}
                      
                      <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-2">
                        Entrance
                      </p>
                      <Link
                        href="/mocktest"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setOpen(false)}
                      >
                        <div className="w-6 h-6 flex items-center justify-center bg-blue-50 rounded-full mr-3">
                          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2-10H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                          </svg>
                        </div>
                        Mock Test
                      </Link>
                      <Link
                        href="/modelquestion"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setOpen(false)}
                      >
                        <div className="w-6 h-6 flex items-center justify-center bg-green-50 rounded-full mr-3">
                          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        </div>
                        Model Question
                      </Link>
                      
                      <Link
                        href="/questions"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 mt-2"
                        onClick={() => setOpen(false)}
                      >
                        Questions
                      </Link>
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100">
                    <button
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex items-center w-full px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}