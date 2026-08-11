import api from "./axios";

export const analyzeEmail = ({ senderEmail, replyTo, subject, body, links, headers, attachments }) =>
  api.post("/email/analyze", { senderEmail, replyTo, subject, body, links, headers, attachments }).then((r) => r.data);
