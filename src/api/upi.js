import api from "./axios";

export const assessUpiTransaction = ({ upiId, recipient, amount, context, firstTimeRecipient }) =>
  api
    .post("/upi/assess", { upiId, recipient, amount, context, firstTimeRecipient })
    .then((r) => r.data);
