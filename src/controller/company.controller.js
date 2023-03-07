const companyModel = require("../model/company.model");
const { v4: uuid } = require("uuid");
const { hash, compare } = require("bcryptjs");
const createError = require("http-errors");
const { generate, reGenerate } = require("../helper/auth.helper");
const response = require("../helper/response.helper");
const cloudinary = require("../helper/cloudinary");

const companyController = {
  // auth
  register: async (req, res, next) => {
    try {
      const id = uuid();
      const { name, email, phone, password } = req.body;
      const hashedPassword = await hash(password, 10);

      const data = {
        id,
        name,
        email,
        phone,
        hashedPassword,
      };

      console.log(data);

      await companyModel.register(data);

      res.json({
        mesg: "register company berhasil",
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
      const result = await companyModel.mailCheck(email);

      if (!result.rowCount) {
        return next(createError(404, "email not registered"));
      }

      const {
        rows: [company],
      } = result;
      const hashedPassword = company.password;

      const valid = await compare(password, hashedPassword);

      if (!valid) {
        return next(createError(403, "E-mail or password incorrect!"));
      }

      delete company.password;

      const payload = {
        id: company.company_id,
        name: company.name,
        email: company.email,
      };

      company.token = generate(payload);
      company.refreshToken = reGenerate(payload);

      res.cookie("token", company.token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 * 1000,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      response(res, company, 200, "login berhasil");
    } catch {
      next(new createError.InternalServerError());
    }
  },

  // Profile
  getCompany: async (req, res, next) => {
    try {
      const data = await companyModel.getCompany();
      const company = data.rows;

      res.json({
        msg: "get company berhasil",
        data: company,
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  getCompanyDetail: async (req, res, next) => {
    try {
      const { id } = req.params;

      const data = await companyModel.getCompanyDetail(id);
      const company = data.rows;

      res.json({
        msg: "get profile berhasil",
        data: company,
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  // home
  getUserList: async (req, res, next) => {
    try {
      const search = req.query.search || "";
      const sortBy = req.query.sortBy;
      const sortOrder = req.query.sortOrder;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 3;
      const offset = (page - 1) * limit;
      const {
        rows: [count],
      } = await companyModel.countUser();
      const totalData = parseInt(count.total);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit,
        totalData,
        totalPage,
      };

      const data = await companyModel.getUserList(
        search,
        sortBy,
        sortOrder,
        limit,
        offset
      );
      const user = data.rows;
      res.json({
        msg: "get user list berhasil",
        data: user,
        pagination: pagination,
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },

  // update
  editCompanyDetail: async (req, res, next) => {
    try {
      const id = req.params.id;
      let logo;

      if (req.file) {
        logo = await cloudinary.uploader.upload(req.file.path);
      }

      const data = {
        id,
        file: logo.url,
        name: req.body.name,
        area: req.body.area,
        location: req.body.location,
        description: req.body.description,
        insta: req.body.insta,
        linkedin: req.body.linkedin,
      };

      await companyModel.editCompanyDetail(data);

      res.json({
        msg: "update company berhasil",
        data: data,
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },
};

module.exports = companyController;
