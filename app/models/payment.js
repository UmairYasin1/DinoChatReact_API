const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paymentSchema = new Schema({
  paymentId: { type: String, default: "", required: true },
  visitor_Id: { type: String, default: ""},
  agent_Id: { type: String, default: ""},
  package_id: { type: String, default: ""},
  amount: { type: Number, default: 0},
  source: { type: String, default: ""},
  description: { type: String, default: ""},
  status: { type: String, default: ""},
  receipt_url:{ type: String, default: ""},
  createdOn: { type: Date, default: Date.now }
});

mongoose.model("Payment", paymentSchema);
