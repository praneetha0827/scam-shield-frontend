import api from "./axios";

export const analyzeEmail = (senderEmail, subject, body) =>
  api.post("/email/analyze", { senderEmail, subject, body }).then((r) => r.data);
