const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const visitorSchema = new Schema({
  visitor_id: { type: String, default: "", required: true },
  visitor_name: { type: String, default: "", required: true },
  visitor_email: { type: String, default: "", required: true },
  visitor_uniqueNum: { type: String, default: "" },
  phone_number: { type: String, default: "", required: true },
  payment_link: { type: String, default: "" },
  brand_id: { type: String, default: "" },
  brand_name: { type: String, default: "" },
  company_name: { type: String, default: "" },
  number_of_employees: { type: String, default: "" },
  web_path: { type: String, default: "" },
  visitor_publicIp: { type: String, default: "" },
  visitor_privateIp: { type: String, default: "" },
  visitor_region_publicIp: [],
  visitor_region_privateIp: [],
  visitor_browser_and_os: [],
  visitor_TimezoneLocation:  { type: String, default: "" },
  no_of_visits : { type: Number, default: 0 },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: "" }
});
mongoose.model("visitor", visitorSchema);
