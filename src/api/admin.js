import api from "./axios";

export const getAllUsersAdmin = () => api.get("/admin/users").then((r) => r.data);
