"use client";

import { useState } from "react";
import SubjectList from "@/app/notes/SubjectList";
import TopicList from "@/app/notes/TopicList";
import NoteViewer from "@/app/notes/NoteViewer";

export default function NotesPage() {
  const [semester, setSemester] = useState<number | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [topic, setTopic] = useState<any>(null);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">BIT Notes</h1>

      {/* Semester */}
      <div className="flex flex-wrap gap-2">
        {[1,2,3,4,5,6,7,8].map((sem) => (
          <button
            key={sem}
            onClick={() => {
              setSemester(sem);
              setSubject(null);
              setTopic(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Sem {sem}
          </button>
        ))}
      </div>

      {semester && (
        <SubjectList
          semester={semester}
          onSelect={(sub) => {
            setSubject(sub);
            setTopic(null);
          }}
        />
      )}

      {subject && (
        <TopicList
          semester={semester!}
          subject={subject}
          onSelect={setTopic}
        />
      )}

      {topic && <NoteViewer note={topic} />}
    </div>
  );
}
