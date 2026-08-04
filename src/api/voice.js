import api from "./axios";

export const analyzeVoice = (callerNumber, transcript) =>
  api.post("/voice/analyze", { callerNumber, transcript }).then((r) => r.data);
