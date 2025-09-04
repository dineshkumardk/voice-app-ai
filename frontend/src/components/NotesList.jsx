import React, { useEffect, useState } from "react";
import { getNotes } from "../services/api";
import NoteCard from "./NoteCard";

const NotesList = () => {
  const [notes, setNotes] = useState([]);

  // Fetch notes from backend
  const loadNotes = async () => {
    try {
      const res = await getNotes();
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to load notes", err);
    }
  };

  useEffect(() => {
    loadNotes();

    // Optional: listen for global refresh events if used elsewhere
    const refreshHandler = () => loadNotes();
    window.addEventListener("refreshNotes", refreshHandler);
    return () => window.removeEventListener("refreshNotes", refreshHandler);
  }, []);

  if (!notes.length) return <p>No notes yet.</p>;

  return (
    <div>
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} onUpdate={loadNotes} />
      ))}
    </div>
  );
};

export default NotesList;