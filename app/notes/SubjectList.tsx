"use client";

import { useEffect, useState } from "react";
import { contentfulClient } from "@/lib/contentful";

export default function SubjectList({ semester, onSelect }: any) {
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await contentfulClient.getEntries({
        content_type: "hamrobit",
        "fields.semester": semester,
      });

      const uniqueSubjects = [
        ...new Set(res.items.map((item: any) => item.fields.subject)),
      ];

      setSubjects(uniqueSubjects);
    };

    fetchSubjects();
  }, [semester]);

  return (
    <div>
      <h2 className="text-xl font-semibold">Subjects</h2>
      <div className="flex gap-2 flex-wrap mt-2">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => onSelect(sub)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            {sub}
          </button>
        ))}
      </div>
    </div>
  );
}
