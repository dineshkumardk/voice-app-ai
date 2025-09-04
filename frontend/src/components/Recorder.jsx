import React, { useState, useRef } from "react";
import { uploadAudio } from "../services/api";

const Recorder = ({ onUpload }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        console.log("Recording stopped, blob size:", blob.size);
        try {
          await uploadAudio(blob);
          onUpload();
        } catch (err) {
          console.error("Upload failed:", err);
          alert("Audio upload failed. Check console.");
        }
      };

      mediaRecorder.start();
      setRecording(true);
      console.log("Recording started");
    } catch (err) {
      console.error("Could not start recording:", err);
      alert("Microphone access required.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      console.log("Recording stopped");
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!recording}>Stop Recording</button>
    </div>
  );
};

export default Recorder;