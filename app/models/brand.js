const mongoose = require("mongoose");
const shortid = require("shortid");
const Schema = mongoose.Schema;


const brandSchema = new Schema({
  brand_id: { type: String, default: "", required: true },
  brand_name: { type: String, default: "", required: true },
  brand_url: { type: String, default: "", required: true },
  createdOn: { type: Date, default: Date.now }
});

mongoose.model("Brand", brandSchema);

const brandModel = mongoose.model("Brand", brandSchema);


const newBrand1 = new brandModel({
    brand_id: shortid.generate(),
    brand_name: 'Web Jazeera',
    brand_url: 'http://webjazeera.com/',
    createdOn: Date.now()
});

const newBrand2 = new brandModel({
    brand_id: shortid.generate(),
    brand_name: 'Resume Profecient',
    brand_url: 'www.resumeprof.com',
    createdOn: Date.now()
});

const newBrand3 = new brandModel({
    brand_id: shortid.generate(),
    brand_name: 'Sumair PC',
    brand_url: 'http://10.1.30.134:5001/',
    createdOn: Date.now()
});

const newBrand4 = new brandModel({
    brand_id: shortid.generate(),
    brand_name: 'Umair PC',
    brand_url: 'http://10.1.30.146:5001/',
    createdOn: Date.now()
});

const newBrand5 = new brandModel({
  brand_id: shortid.generate(),
  brand_name: 'Chat Server',
  brand_url: 'http://173.254.252.226:5001/',
  createdOn: Date.now()
});

const newBrand6 = new brandModel({
  brand_id: shortid.generate(),
  brand_name: 'Video Profs',
  brand_url: 'https://www.videoprofs.io/',
  createdOn: Date.now()
});

brandModel.findOne(
  { $and: [{ brand_url: 'http://webjazeera.com/' }] },
  function(err, result) {
    if (result == null || result == undefined || result == "") {
        newBrand1.save();
    } 
  }
);

brandModel.findOne(
  { $and: [{ brand_url: 'www.resumeprof.com' }] },
  function(err, result) {
    if (result == null || result == undefined || result == "") {
        newBrand2.save();
    } 
  }
);

brandModel.findOne(
    { $and: [{ brand_url: 'http://10.1.30.134:5001/' }] },
    function(err, result) {
      if (result == null || result == undefined || result == "") {
          newBrand3.save();
      } 
    }
  );

  brandModel.findOne(
    { $and: [{ brand_url: 'http://10.1.30.146:5001/' }] },
    function(err, result) {
      if (result == null || result == undefined || result == "") {
          newBrand4.save();
      } 
    }
  );

  brandModel.findOne(
    { $and: [{ brand_url: 'http://173.254.252.226:5001/' }] },
    function(err, result) {
      if (result == null || result == undefined || result == "") {
          newBrand5.save();
      } 
    }
  );

  brandModel.findOne(
    { $and: [{ brand_url: 'https://www.videoprofs.io/' }] },
    function(err, result) {
      if (result == null || result == undefined || result == "") {
          newBrand6.save();
      } 
    }
  );