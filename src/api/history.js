import api from "./axios";

export const getScanHistory = ({ page = 1, limit = 10, type = "", verdict = "" } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (type) params.set("type", type);
  if (verdict) params.set("verdict", verdict);
  return api.get(`/scans?${params.toString()}`).then((r) => r.data);
};
