import React, { useState } from "react";
import axios from "axios";

const NoteCard = ({ note, onUpdate }) => {
  const [editable, setEditable] = useState(false);
  const [transcript, setTranscript] = useState(note.transcript);
  const [summary, setSummary] = useState(note.summary);

  const handleEdit = async () => {
    await axios.put(`/api/notes/${note._id}/transcript`, { transcript });
    onUpdate();
  };

  const generateSummary = async () => {
    const { data } = await axios.post('/api/notes/summarize', { id: note._id });
    setSummary(data.summary);
    onUpdate();
  };

  return (
    <div>
      {editable ? (
        <textarea value={transcript} onChange={e => setTranscript(e.target.value)} />
      ) : (
        <p>{transcript}</p>
      )}
      {summary && <div><b>Summary:</b> {summary}</div>}
      <button onClick={() => setEditable(!editable)}>Edit</button>
      <button onClick={handleEdit}>Save</button>
      <button
        disabled={!!summary && !note.transcriptEdited}
        onClick={generateSummary}
      >
        Generate Summary
      </button>
    </div>
  );
};

export default NoteCard;
