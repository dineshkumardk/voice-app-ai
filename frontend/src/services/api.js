import axios from "axios";

const API_BASE = "https://voice-notes-app-pw2a.onrender.com/api/notes";

export const uploadAudio = (file) => {
  const formData = new FormData();
  formData.append("audio", file);
  return axios.post(`${API_BASE}/upload`, formData);
};

export const getNotes = () => axios.get(API_BASE);

export const updateTranscript = (id, transcript) =>
  axios.put(`${API_BASE}/${id}`, { transcript });

export const deleteNote = (id) => axios.delete(`${API_BASE}/${id}`);

export const generateSummary = (id) =>
  axios.post(`${API_BASE}/summarize`, { id });