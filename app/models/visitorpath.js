const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const visitorpathSchema = new Schema({
  path_id: { type: String, default: "", required: true },
  visitor_id: { type: String, default: "" },
  visitor_name: { type: String, default: "" },
  visitor_email: { type: String, default: "" },
  visitor_uniqueNum: { type: String, default: "" },
  completePath : { type: String, default: "" },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
});
mongoose.model("visitorPath", visitorpathSchema);
