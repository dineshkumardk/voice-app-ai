import React from "react";
import Recorder from "./components/Recorder";
import NotesList from "./components/NotesList";

const App = () => {
  const refreshNotes = () => {
    window.dispatchEvent(new Event("refreshNotes"));
  };

  return (
    <div className="app-container">
      <h1>Voice Notes</h1>
      <Recorder onUpload={refreshNotes} />
      <NotesList />
    </div>
  );
};

export default App;
