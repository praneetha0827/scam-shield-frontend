import api from "./axios";

export const analyzeInterceptor = ({ message, url, email, phoneNumber, upiId, notes }) =>
  api
    .post("/interceptor/analyze", { message, url, email, phoneNumber, upiId, notes })
    .then((r) => r.data);
