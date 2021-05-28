const mongoose = require("mongoose");
const shortid = require("shortid");
const Schema = mongoose.Schema;


const teamSchema = new Schema({
  team_id: { type: String, default: "", required: true },
  team_name: { type: String, default: "", required: true },
  createdOn: { type: Date, default: Date.now }
});


mongoose.model("Team", teamSchema);

const teamModel = mongoose.model("Team", teamSchema);


const newTeam1 = new teamModel({
    team_id: shortid.generate(),
    team_name: 'Team Kamran Ghori',
    createdOn: Date.now()
});

const newTeam2 = new teamModel({
    team_id: shortid.generate(),
    team_name: 'Team Taha Rashid',
    createdOn: Date.now()
});

const newTeam3 = new teamModel({
    team_id: shortid.generate(),
    team_name: 'Team Leroy Dias',
    createdOn: Date.now()
});

const newTeam4 = new teamModel({
  team_id: shortid.generate(),
  team_name: 'Team Aamir Younus',
  createdOn: Date.now()
});


teamModel.findOne(
    { $and: [{ team_name: 'Team Kamran Ghori' }] },
    function(err, result) {
      if (result == null || result == undefined || result == "") {
        newTeam1.save();
      } 
    }
  );

  teamModel.findOne(
    { $and: [{ team_name: 'Team Taha Rashid' }] },
    function(err, result) {
      if (result == null || result == undefined || result == "") {
        newTeam2.save();
      } 
    }
  );

  teamModel.findOne(
    { $and: [{ team_name: 'Team Leroy Dias' }] },
    function(err, result) {
      if (result == null || result == undefined || result == "") {
        newTeam3.save();
      } 
    }
  );

  teamModel.findOne(
    { $and: [{ team_name: 'Team Aamir Younus' }] },
    function(err, result) {
      if (result == null || result == undefined || result == "") {
        newTeam4.save();
      } 
    }
  );