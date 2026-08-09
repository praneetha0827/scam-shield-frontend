import api from "./axios";

export const analyzeWhatsApp = (message) =>
  api.post("/whatsapp/analyze", { message }).then((r) => r.data);
