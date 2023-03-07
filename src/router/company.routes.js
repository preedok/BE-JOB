const express = require("express");
const {
  register,
  login,
  getCompany,
  getCompanyDetail,
  getUserList,
  editCompanyDetail,
} = require("../controller/company.controller");
const upload = require("../middleware/multer");
const router = express.Router();

router
  // auth
  .post("/register", register)
  .post("/login", login)

  // profile
  .get("/list", getCompany)
  .get("/detail/:id", getCompanyDetail)

  // home
  .get("/user/list", getUserList)

  // update user data
  .put("/update/:id", upload.single("logo"), editCompanyDetail);

module.exports = router;
