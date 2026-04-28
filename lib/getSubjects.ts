import { contentfulClient } from "./contentful";

export async function getSubjects(semester: number) {
  console.log("1. getSubjects called with semester:", semester);
  console.log("2. Type of semester:", typeof semester);
  
  try {
    const res = await contentfulClient.getEntries({
      content_type: "hamrobit",
      "fields.semester": semester,
    });
    
    console.log("3. Contentful response received");
    console.log("4. Total items found:", res.items.length);
    
    if (res.items.length > 0) {
      console.log("5. First item sample:", {
        semester: res.items[0].fields.semester,
        subject: res.items[0].fields.subject,
        topic: res.items[0].fields.topic
      });
    }
    
    // remove duplicates
    const subjects = new Set(
      res.items.map((item: any) => item.fields.subject)
    );
    
    console.log("6. Unique subjects found:", Array.from(subjects));
    
    return Array.from(subjects);
  } catch (error) {
    console.error("7. Error in getSubjects:", error);
    return []; // Return empty array on error
  }
}