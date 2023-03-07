const express = require("express");
const {
  register,
  login,
  getUserDetail,
  editUserDetail,
  insertSkill,
  getUserSkill,
  deleteSkill,
  insertPortfolio,
  getUserPortfolio,
  editPortfolio,
  deletePortfolio,
  insertExperience,
  getUserExperience,
  editExperience,
  deleteExperience,
} = require("../controller/user.controller");
const upload = require("../middleware/multer");
const router = express.Router();

router

  // auth
  .post("/register", register)
  .post("/login", login)

  // profile
  .get("/:id", getUserDetail)
  .get("/:id/skill", getUserSkill)
  .get("/:id/portfolio", getUserPortfolio)
  .get("/:id/experience", getUserExperience)

  // insert new data
  .post("/skill", insertSkill)
  .post("/portfolio", upload.single("image"), insertPortfolio)
  .post("/experience", upload.single("image"), insertExperience)

  // update user data
  .put("/update/:id", upload.single("avatar"), editUserDetail)
  .put("/:id/portfolio/:porto_id", upload.single("image"), editPortfolio)
  .put("/:id/experience/:exp_id", editExperience)

  // delete user data
  .delete("/skill/:skill_id", deleteSkill)
  .delete("/portfolio/:porto_id", deletePortfolio)
  .delete("/experience/:exp_id", deleteExperience);

module.exports = router;
