require("dotenv").config();

const express = require("express");
// const cors = require("cors");
const cookieParser = require('cookie-parser');
// const helmet = require("helmet");
const xss = require("xss-clean");
const morgan = require("morgan");
const createError = require("http-errors");
const path = require("path");

const main = require("./src/router");

const app = express();
const PORT = process.env.PORT || 4000;

// app.use(cors({
//   credentials: true,
//   origin:["https://portalkerja2023.vercel.app", "http://localhost:3000"]
// }));
// app.use(cookieParser());
// app.use(
//   helmet({
//     crossOriginResourcePolicy: false,
//   })
// );
app.use(xss());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use("/v1", main);

app.use("/avatar", express.static(path.join(__dirname, "/upload/avatar")));
app.use("/company", express.static(path.join(__dirname, "/upload/company")));
app.use("/portofolio", express.static(path.join(__dirname, "/upload/portfolio")));

app.all("*", (req, res, next) => {
  next(new createError.NotFound());
});

app.use((err, req, res) => {
  const msg = err.message || "Internal Server Error";
  const code = err.status || 500;

  res.status(code).json({
    message: msg,
  });
});

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ${PORT}`);
});
