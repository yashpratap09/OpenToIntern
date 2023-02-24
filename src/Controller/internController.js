//=====================Importing Module and Packages=====================//
const internModel = require("../Model/internModel");
const collegeModel = require("../Model/collegeModel");
const {
  valid,
  regForEmail,
  regForMobileNo,
} = require("../Validation/validation");

//===================== This function is used for Creating an Intern =====================//
const createIntern = async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin',"*")
  try {
    let data = req.body
    let { name, email, mobile, collegeName } = data;
    if (!(name)) {
      return res.status(400).send({ status: false, msg: "Please Provide name" });
    }
    if (!(email)) {
      return res.status(400).send({ status: false, msg: "Please Provide email" });
    }
    if (!(mobile)) {
      return res.status(400).send({ status: false, msg: "Please Provide mobile" });
    }
    if (!(collegeName)) {
      return res.status(400).send({ status: false, msg: "Please Provide collegeName" });
    }
    if (!valid(name))
      return res.status(400).send({ status: false, msg: "Provide a valid Name." });
   

    //===================== Validation of Email and Checking Duplicate Value =====================//
    if (!valid(email))
      return res.status(400).send({ status: false, msg: "Provide a valid Email." });
    if (!regForEmail(email))
      return res.status(400).send({ status: false, msg: "Invalid Email." });
    let checkDuplicate = await internModel.findOne({ email: email });
    if (checkDuplicate) {
      return res.status(400).send({ status: false, msg: "Email Already Exist." });
    }

    //===================== Validation of Mobile Number and Checking Duplicate Value =====================//
    if (!valid(mobile))
      return res.status(400).send({ status: false, msg: "Provide a valid Mobile Number." });
    if (!regForMobileNo(mobile))
      return res.status(400).send({ status: false, msg: "Invalid Mobile Number." });
    let duplicateMobile = await internModel.findOne({ mobile: mobile });
    if (duplicateMobile) {
      return res.status(400).send({ status: false, msg: "Mobile Number Already Exist." });
    }

    //===================== Validation of CollegeName =====================//
    data.collegeName = collegeName.toLowerCase();
    if (!valid(collegeName))
      return res.status(400).send({ status: false, msg: "Provide a valid College Name." });

    //===================== Fetching College Data from DB =====================//
    let getCollegeId = await collegeModel.findOne({$or:[{ fullName: data.collegeName} , {name:data.collegeName }]});
    if (!getCollegeId) {                        
      return res
        .status(400)
        .send({ status: false, msg: `Your ${data.collegeName} is not Exist.` });
    }

    //===================== Creating CollegeId inside Body with Key and Value =====================//
    data.collegeId = getCollegeId["_id"];
    
    //===================== Creating Intern Data in DB =====================//
    let internData = await internModel.create(data);

    let obj = {
     
      name: internData.name,
      email: internData.email,
      mobile: internData.mobile,
      collegeId: internData.collegeId,
      isDeleted: internData.isDeleted,
    }
    res.status(201).send({status: true,msg: `${name}'s Intern Data Created Sucessfully.`,data: obj});
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

//=====================Module Export=====================//
module.exports = createIntern;
