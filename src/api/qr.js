import api from "./axios";

export const analyzeQr = (qrData) => api.post("/qr/analyze", { qrData }).then((r) => r.data);
