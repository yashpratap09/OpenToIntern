//=====================Importing Module and Packages=====================//
const collegeModel = require("../Model/collegeModel");
const internModel = require("../Model/internModel");
const {
  valid,
  regForName,
  regForLink,
  regForExtension,
} = require("../Validation/validation");

//===================== This function is used for Creating a College Data =====================//
const createCollege = async function (req, res) {
 res.setHeader('Access-Control-Allow-Origin',"*")

  try {
    let data = req.body;

    //===================== Destructing Data =====================//
    let { name, fullName, logoLink } = data;

    //===================== Checking the Mandatory Field =====================//
    if (!(name)) {
      return res.status(400).send({ status: false, msg: "Please provide name" });
    }

    if (!(fullName)) {
      return res.status(400).send({ status: false, msg: "Please provide fullName" });
    }
    if (!(logoLink)) {
      return res.status(400).send({ status: false, msg: "Please provide logoLink" });
    }
  
    if (!valid(name))
      return res.status(400).send({ status: false, msg: "Provide a valid Name" });
    if (!regForName(name))
      return res.status(400).send({ status: false, msg: "Invalid Name" });

    data.name = name.toLowerCase();

    //===================== Checking the Duplicate Value for Unique =====================//
    let checkDuplicate = await collegeModel.findOne({ name: data.name });
    if (checkDuplicate) {
      return res.status(400).send({
        status: false,
        msg: `The ${data.name} is already exist. Please provide another College Name.`,
      });
    }
    data.fullName= fullName.toLowerCase()
    let FullNamecheckDuplicate = await collegeModel.findOne({ fullName: data.fullName });
    if (FullNamecheckDuplicate) {
        return res.status(400).send({
          status: false,
          msg: `The ${data.fullName} is already exist. Please provide another College Name.`,
        });
      }
    
      

    if (!valid(fullName))
      return res.status(400).send({ status: false, msg: "Provide a valid fullName" });
   

    //=====================Validation of Logo Link=====================//
    if (!valid(logoLink))
      return res.status(400).send({ status: false, msg: "Provide a valid logoLink" });
    if (!regForLink(logoLink))
      return res.status(400).send({ status: false, msg: "Invalid Link" });
    if (!regForExtension(logoLink))
      return res.status(400).send({ status: false, msg: "Invalid Extension Format in logoLink." });

    //===================== Creating College Data in DB =====================//
    
    let collegeData = await collegeModel.create(data);

    let obj = {
      name: collegeData.name,
      fullName: collegeData.fullName,
      logoLink: collegeData.logoLink,
      isDeleted: collegeData.isDeleted,
    };
    res.status(201).send({status: true,
      msg: `${data.name} College Data Created Successfully.`,
      data: obj,
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

//===================== This function is used for Get College Data =====================//






const getCollegeData = async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin',"*")
  try {
    let collegeName = req.query.collegeName;
    if (Object.keys(req.query).length == 0) {
      return res.status(400).send({ status: false, msg: "CollegeName is Mandatory" });
    }
    if (!collegeName) {
      return res.status(400).send({ status: false, msg: "Please Enter your CollegeName" });
    }
    let getCollegeName = await collegeModel
      .findOne({$or:[ {fullName: collegeName.toLowerCase()}, {name:collegeName.toLowerCase()}]})
    if (!getCollegeName) {
      return res.status(404).send({ status: false, msg: `${collegeName} not Found.` });
    }
    let getinternName = await internModel
      .find({ collegeId: getCollegeName["_id"] })
      .select({ name: 1, email: 1, mobile: 1 });
     
    let obj = {};
    obj.name = getCollegeName.name;
    obj.fullName = getCollegeName.fullName;
    obj.logoLink = getCollegeName.logoLink;
    obj.interns = getinternName;
    if (getinternName.length == 0) {
      return res.status(200).send({data: obj,interns: `Intern is not available at this ${collegeName}.`,});
    }
    res.status(200).send({ status: true, data: obj });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

//=====================Module Export=====================//
module.exports = { createCollege, getCollegeData };
