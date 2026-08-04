import api from "./axios";

export const analyzeSms = (message) => api.post("/sms/analyze", { message }).then((r) => r.data);
