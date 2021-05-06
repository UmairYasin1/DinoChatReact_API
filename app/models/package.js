const mongoose = require("mongoose");
const shortid = require("shortid");
const Schema = mongoose.Schema;


const packageSchema = new Schema({
  package_id: { type: String, default: "", required: true },
  package_name: { type: String, default: "", required: true },
  createdOn: { type: Date, default: Date.now }
});

mongoose.model("Package", packageSchema);

const packageModel = mongoose.model("Package", packageSchema);

//#region package extra code

// const newPackage = new packageModel(
//   { package_id: shortid.generate(), package_name: 'Package 1', createdOn : Date.now() },
//   { package_id: shortid.generate(), package_name: 'Package 2', createdOn : Date.now() },
//   { package_id: shortid.generate(), package_name: 'Package 3', createdOn : Date.now() },
//   { package_id: shortid.generate(), package_name: 'Package 4', createdOn : Date.now() },
//   { package_id: shortid.generate(), package_name: 'Package 5', createdOn : Date.now() },
//   { package_id: shortid.generate(), package_name: 'Package 6', createdOn : Date.now() }
  
// );
// newPackage1.save();

// const newPackage2 = new packageModel({ package_id: shortid.generate(), package_name: 'Package 2', createdOn : Date.now() });
// newPackage2.save();

// const newPackage3 = new packageModel({ package_id: shortid.generate(), package_name: 'Package 3', createdOn : Date.now() });
// newPackage3.save();

// const newPackage4 = new packageModel({ package_id: shortid.generate(), package_name: 'Package 4', createdOn : Date.now() });
// newPackage4.save();

// const newPackage5 = new packageModel({ package_id: shortid.generate(), package_name: 'Package 5', createdOn : Date.now() });
// newPackage5.save();

// const newPackage6 = new packageModel({ package_id: shortid.generate(), package_name: 'Package 6', createdOn : Date.now() });
// newPackage6.save();


// packageModel.findOne(
//   { 
//     $and: [
//       {
//         $or: 
//         [
//           { package_name : 'Package 1' }, 
//           { package_name : 'Package 2' },
//           { package_name : 'Package 3' }, 
//           { package_name : 'Package 4' },
//           { package_name : 'Package 5' }, 
//           { package_name : 'Package 6' }
//         ]
//       }
//     ] 
//   },
//   function(err, result) {
//     if (result == null || result == undefined || result == "") {
//       newPackage.save();
//     } 
//   }
// );


// var myobj = [
//     { package_id: shortid.generate(), package_name: 'Package 1', createdOn : Date.now() },
//     { package_id: shortid.generate(), package_name: 'Package 2', createdOn : Date.now() },
//     { package_id: shortid.generate(), package_name: 'Package 3', createdOn : Date.now() },
//     { package_id: shortid.generate(), package_name: 'Package 4', createdOn : Date.now() },
//     { package_id: shortid.generate(), package_name: 'Package 5', createdOn : Date.now() },
//     { package_id: shortid.generate(), package_name: 'Package 6', createdOn : Date.now() },
//     { package_id: shortid.generate(), package_name: 'Package 7', createdOn : Date.now() },
//   ];

//   packageModel.insertMany(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("Number of documents inserted: " + res.insertedCount);
//   });

// const newPackage = new packageModel(
//     { package_id: shortid.generate(), package_name: 'Package 1', createdOn : Date.now() },
//     { package_id: shortid.generate(), package_name: 'Package 2', createdOn : Date.now() },
//     { package_id: shortid.generate(), package_name: 'Package 3', createdOn : Date.now() },
//     { package_id: shortid.generate(), package_name: 'Package 4', createdOn : Date.now() },
//     { package_id: shortid.generate(), package_name: 'Package 5', createdOn : Date.now() },
//     { package_id: shortid.generate(), package_name: 'Package 6', createdOn : Date.now() },
//     { package_id: shortid.generate(), package_name: 'Package 7', createdOn : Date.now() }
// );

//packageModel.insertMany(myobj);
// packageModel.findOne(
//   { $and: [{ role_name: 'agent' }] },
//   function(err, result) {
//     if (result == null || result == undefined || result == "") {
//       newRole.save();
//     } 
//   }
// );

//#endregion


const newPackage1 = new packageModel({
  package_id: shortid.generate(),
  package_name: 'Basic - logo',
  createdOn: Date.now()
});

const newPackage2 = new packageModel({
  package_id: shortid.generate(),
  package_name: 'Starup - logo',
  createdOn: Date.now()
});

const newPackage3 = new packageModel({
  package_id: shortid.generate(),
  package_name: 'Basic - web',
  createdOn: Date.now()
});

const newPackage4 = new packageModel({
  package_id: shortid.generate(),
  package_name: 'Startup - web',
  createdOn: Date.now()
});

const newPackage5 = new packageModel({
  package_id: shortid.generate(),
  package_name: 'Basic - animation',
  createdOn: Date.now()
});

const newPackage6 = new packageModel({
  package_id: shortid.generate(),
  package_name: 'Startup - animation',
  createdOn: Date.now()
});



packageModel.findOne(
  { $and: [{ package_name: 'Basic - logo' }] },
  function(err, result) {
    if (result == null || result == undefined || result == "") {
      newPackage1.save();
    } 
  }
);

packageModel.findOne(
  { $and: [{ package_name: 'Starup - logo' }] },
  function(err, result) {
    if (result == null || result == undefined || result == "") {
      newPackage2.save();
    } 
  }
);

packageModel.findOne(
  { $and: [{ package_name: 'Basic - web' }] },
  function(err, result) {
    if (result == null || result == undefined || result == "") {
      newPackage3.save();
    } 
  }
);

packageModel.findOne(
  { $and: [{ package_name: 'Startup - web' }] },
  function(err, result) {
    if (result == null || result == undefined || result == "") {
      newPackage4.save();
    } 
  }
);

packageModel.findOne(
  { $and: [{ package_name: 'Basic - animation' }] },
  function(err, result) {
    if (result == null || result == undefined || result == "") {
      newPackage5.save();
    } 
  }
);

packageModel.findOne(
  { $and: [{ package_name: 'Startup - animation' }] },
  function(err, result) {
    if (result == null || result == undefined || result == "") {
      newPackage6.save();
    } 
  }
);
