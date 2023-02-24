//=====================Importing Module and Packages=====================//
const express = require("express");
const route = require("./routes/route.js");
const { default: mongoose } = require("mongoose");
const app = express();
const multer = require("multer")

app.use(express.json());
app.use(multer().any());


mongoose
  .connect(
    "mongodb+srv://palsubodh:Palsubodh@cluster0.mhegah9.mongodb.net/Intern",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is Connected."))
  .catch((error) => console.log(error));

app.use("/", route);

//===================== It will Handle error When You input Wrong Route =====================//
app.use(function (req, res) {
  var err = new Error("Not Found.");
  err.status = 404;
  return res.status(400).send({ status: "400", msg: "Bad request" });
});

app.listen(process.env.PORT || 3001, function () {
  console.log("Express App Running on Port: " + (process.env.PORT || 3001));
});
