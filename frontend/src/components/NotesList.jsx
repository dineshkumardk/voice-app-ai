import React, { useEffect, useState } from "react";
import { getNotes } from "../services/api";
import NoteCard from "./NoteCard";
import Recorder from "./Recorder";

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

    // Optional: listen for global refresh events
    const refreshHandler = () => loadNotes();
    window.addEventListener("refreshNotes", refreshHandler);
    return () => window.removeEventListener("refreshNotes", refreshHandler);
  }, []);

  // Handle new note from Recorder
  const handleNewNote = (newNote) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  return (
    <div>
      <Recorder onUpload={handleNewNote} />

      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        notes.map((note) => (
          <NoteCard key={note._id} note={note} onUpdate={loadNotes} />
        ))
      )}
    </div>
  );
};

export default NotesList;