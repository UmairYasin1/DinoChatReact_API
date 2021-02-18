const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSchema = new Schema({
  msgId: { type: String, default: "" },
  repMsgId: { type: String, default: "" },
  msgFrom: { type: String, default: "", required: true },
  msgTo: { type: String, default: "" },
  msg: { type: String, default: "" },
  isRead: { type: Boolean, default: false },
  file: { type: String, default: "",},
  room: { type: String, default: "", required: true },
  createdOn: { type: Date, default: Date.now }
});

mongoose.model("Chat", chatSchema);
