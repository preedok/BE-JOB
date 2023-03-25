const userModel = require("../model/user.model");
const { v4: uuid } = require("uuid");
const { hash, compare } = require("bcryptjs");
const createError = require("http-errors");
const { generate, reGenerate } = require("../helper/auth.helper");
const response = require("../helper/response.helper");
const cloudinary = require("../helper/cloudinary");

const userController = {
  //get user all

  // auth
  register: async (req, res, next) => {
    try {
      const id = uuid();
      const { fullname, email, phone, password } = req.body;
      const hashedPassword = await hash(password, 10);

      const data = {
        id,
        fullname,
        email,
        phone,
        hashedPassword,
      };

      console.log(data);

      await userModel.register(data);

      res.json({
        mesg: "register berhasil",
        data: data,
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await userModel.mailCheck(email);

      if (!result.rowCount) {
        return next(createError(404, "email not registered"));
      }

      const {
        rows: [user],
      } = result;
      const hashedPassword = user.password;

      const valid = await compare(password, hashedPassword);

      if (!valid) {
        return next(createError(403, "E-mail or password incorrect!"));
      }

      delete user.password;

      const payload = {
        id: user.user_id,
        username: user.fullname,
        email: user.email,
      };

      user.token = generate(payload);
      user.refreshToken = reGenerate(payload);

      // res.cookie("token", user.token, {
      //   httpOnly: true,
      //   maxAge: 60 * 60 * 24 * 7 * 1000,
      //   secure: false,
      //   path: "/",
      //   sameSite: "strict"
      // });

      response(res, user, 200, "Login berhasil");
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },
  // profile
  getUserDetail: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await userModel.getUserDetail(id);
      const [user] = data.rows;

      res.json({
        msg: "get profile berhasil",
        data: user,
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  getUserSkill: async (req, res, next) => {
    try {
      const { id } = req.params;

      const data = await userModel.getUserSkill(id);
      const skill = data.rows;

      res.json({
        msg: "get user skill berhasil",
        skills: skill,
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  getUserPortfolio: async (req, res, next) => {
    try {
      const { id } = req.params;

      const data = await userModel.getUserPortfolio(id);
      const porto = data.rows;

      res.json({
        msg: "get user skill berhasil",
        portfolio: porto,
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  getUserExperience: async (req, res, next) => {
    try {
      const { id } = req.params;

      const data = await userModel.getUserExperience(id);
      const exp = data.rows;

      res.json({
        msg: "get user experience berhasil",
        experiences: exp,
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  // insert
  insertSkill: async (req, res, next) => {
    try {
      const { id, name } = req.body;

      await userModel.insertSkill(id, name);

      res.json({
        msg: "insert skill berhasil",
        skill: name,
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  insertPortfolio: async (req, res, next) => {
    try {
      let image;
      if (req.file) {
        image = await cloudinary.uploader.upload(req.file.path);
      }

      const data = {
        id: req.body.id,
        name: req.body.name,
        link: req.body.link,
        type: req.body.type,
        file: image.url,
      };

      await userModel.insertPortfolio(data);

      res.json({
        msg: "insert porto berhasil",
        data: data,
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  insertExperience: async (req, res, next) => {
    try {
      let image;
      if (req.file) {
        image = await cloudinary.uploader.upload(req.file.path);
      }
      const data = {
        id: req.body.id,
        company_name: req.body.company_name,
        position: req.body.position,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        description: req.body.description,
        file: image.url,
      };
      await userModel.insertExperience(data);
      res.json({
        msg: "insert experience berhasil",
        data: data,
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },
  // update
  editUserDetail: async (req, res, next) => {
    try {
      const { id } = req.params;

      let avatar;

      if (req.file) {
        avatar = await cloudinary.uploader.upload(req.file.path);
      }

      const data = {
        id,
        fullname: req.body.fullname,
        phone: req.body.phone,
        file: avatar.url,
        title: req.body.title,
        location: req.body.location,
        description: req.body.description,
        insta: req.body.insta,
        github: req.body.github,
        linkedin: req.body.linkedin,
      };

      await userModel.editUserDetail(data);

      res.json({
        msg: "update profile berhasil",
        data: data,
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  editPortfolio: async (req, res, next) => {
    try {
      const { id, porto_id } = req.params;

      let image;

      if (req.file) {
        image = await cloudinary.uploader.upload(req.file.path);
      }

      const data = {
        id,
        porto_id,
        name: req.body.name,
        link: req.body.link,
        type: req.body.type,
        file: image.url,
      };

      console.log(data);

      await userModel.editPortfolio(data);

      res.json({
        msg: "update portfolio berhasil",
        data: data,
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  editExperience: async (req, res, next) => {
    try {
      const { id, exp_id } = req.params;

      const data = {
        id,
        exp_id,
        company_id: req.body.company_id,
        start: req.body.start,
        date: req.body.date,
        description: req.body.description,
      };

      console.log(data);

      await userModel.editExperience(data);

      res.json({
        msg: "update experience berhasil",
        data: data,
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  // delete
  deleteSkill: async (req, res, next) => {
    try {
      const { skill_id } = req.params;

      await userModel.deleteSkill(skill_id);

      res.json({
        msg: "delete skill berhasil",
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  deletePortfolio: async (req, res, next) => {
    try {
      const { porto_id } = req.params;

      await userModel.deletePortfolio(porto_id);

      res.json({
        msg: "delete portfolio berhasil",
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  deleteExperience: async (req, res, next) => {
    try {
      const { exp_id } = req.params;

      await userModel.deleteExperience(exp_id);

      res.json({
        msg: "delete experience berhasil",
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },
};

module.exports = userController;
