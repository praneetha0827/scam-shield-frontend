import api from "./axios";

export const analyzeWebsite = (url) => api.post("/website/analyze", { url }).then((r) => r.data);
