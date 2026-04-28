"use client";

import { useEffect, useState } from "react";
import { contentfulClient } from "@/lib/contentful";

export default function TopicList({ semester, subject, onSelect }: any) {
  const [topics, setTopics] = useState<any[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const res = await contentfulClient.getEntries({
        content_type: "hamrobit",
        "fields.semester": semester,
        "fields.subject": subject,
      });

      setTopics(res.items);
    };

    fetchTopics();
  }, [semester, subject]);

  return (
    <div>
      <h2 className="text-xl font-semibold">Topics</h2>
      <div className="flex flex-wrap gap-2 mt-2">
        {topics.map((item: any) => (
          <button
            key={item.sys.id}
            onClick={() => onSelect(item.fields)}
            className="px-3 py-1 bg-green-200 rounded"
          >
            {item.fields.topic}
          </button>
        ))}
      </div>
    </div>
  );
}
