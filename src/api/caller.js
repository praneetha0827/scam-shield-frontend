import api from "./axios";

export const analyzeCaller = ({ callerNumber, claimedOrganization, context, unknownCaller }) =>
  api
    .post("/caller/analyze", { callerNumber, claimedOrganization, context, unknownCaller })
    .then((r) => r.data);
