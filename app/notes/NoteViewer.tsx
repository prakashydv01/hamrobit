export default function NoteViewer({ note }: any) {
  return (
    <div className="mt-6 p-6 border rounded bg-white">
      <h2 className="text-2xl font-bold mb-4">{note.topic}</h2>

      {/* TEXT */}
      {note.plainText && (
        <p className="whitespace-pre-line">{note.plainText}</p>
      )}

      {/* RICH TEXT */}
      {note.richContent && (
        <div
          dangerouslySetInnerHTML={{
            __html: note.richContent,
          }}
        />
      )}

      {/* FILE (PDF / DOC) */}
      {note.file && (
        <iframe
          src={`https:${note.file.fields.file.url}`}
          className="w-full h-[600px] mt-4"
        />
      )}
    </div>
  );
}
