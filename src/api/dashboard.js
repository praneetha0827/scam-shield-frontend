import api from "./axios";

export const getDashboardStats = () => api.get("/dashboard/stats").then((r) => r.data);
export const getRecentScans = (limit = 5) => api.get(`/scans/recent?limit=${limit}`).then((r) => r.data);
export const getLatestScan = () => api.get("/scans/latest").then((r) => r.data);
