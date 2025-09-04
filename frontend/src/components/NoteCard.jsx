import React, { useState } from "react";
import { updateTranscript, generateSummary as apiGenerateSummary } from "../services/api";

const NoteCard = ({ note, onUpdate }) => {
  const [editable, setEditable] = useState(false);
  const [transcript, setTranscript] = useState(note.transcript);
  const [summary, setSummary] = useState(note.summary);
  const [transcriptEdited, setTranscriptEdited] = useState(note.transcriptEdited || false);
  const [loading, setLoading] = useState(false);

  // Save transcript edits
  const handleEdit = async () => {
    try {
      setLoading(true);
      await updateTranscript(note._id, transcript);
      setSummary(""); // Clear old summary
      setTranscriptEdited(true);
      setEditable(false);
      onUpdate(); // Refresh notes list if needed
    } catch (err) {
      console.error("Failed to update transcript:", err);
      alert("Transcript update failed.");
    } finally {
      setLoading(false);
    }
  };

  // Generate summary
  const handleGenerateSummary = async () => {
    try {
      setLoading(true);
      const res = await apiGenerateSummary(note._id);
      setSummary(res.data.summary);
      setTranscriptEdited(false);
      onUpdate();
    } catch (err) {
      console.error("Failed to generate summary:", err);
      alert("Summary generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px" }}>
      <audio src={`https://voice-notes-apps-1.onrender.com/${note.audioUrl}`} controls />
      {editable ? (
        <textarea
          value={transcript}
          onChange={(e) => {
            setTranscript(e.target.value);
            setTranscriptEdited(true); // mark edited
          }}
          style={{ width: "100%", minHeight: "60px", marginTop: "5px" }}
        />
      ) : (
        <p>{transcript}</p>
      )}

      {summary && (
        <div style={{ marginTop: "5px", background: "#f0f0f0", padding: "5px" }}>
          <b>Summary:</b> {summary}
        </div>
      )}

      <button onClick={() => setEditable(!editable)} style={{ marginTop: "5px" }}>
        {editable ? "Cancel" : "Edit"}
      </button>
      {editable && (
        <button onClick={handleEdit} style={{ marginLeft: "5px" }} disabled={loading}>
          Save
        </button>
      )}
      <button
        disabled={!!summary && !transcriptEdited}
        onClick={handleGenerateSummary}
        style={{ marginLeft: "5px" }}
      >
        Generate Summary
      </button>
    </div>
  );
};

export default NoteCard;