import api from "./axios";

export const getReportSummary = (days = 30) => api.get(`/reports/summary?days=${days}`).then((r) => r.data);

export const downloadCsvReport = async () => {
  const res = await api.get("/reports/export.csv", { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `scam-shield-report-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
