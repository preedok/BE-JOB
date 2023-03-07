const pool = require("../config/db");

const userModel = {
  //get all user

  // auth
  register: ({ id, fullname, email, phone, hashedPassword }) => {
    return pool.query(
      `
        INSERT INTO users (user_id, fullname, email, phone, password)
        VALUES ($1, $2, $3, $4, $5)
        `,
      [id, fullname, email, phone, hashedPassword]
    );
  },

  mailCheck: (email) => {
    return pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  },

  // profile
  getUserDetail: (id) => {
    return pool.query(`SELECT * FROM users WHERE user_id = $1`, [id]);
  },

  getUserSkill: (id) => {
    return pool.query(`SELECT * FROM skills WHERE user_id = $1`, [id]);
  },

  getUserPortfolio: (id) => {
    return pool.query(`SELECT * FROM portfolio WHERE user_id = $1`, [id]);
  },

  getUserExperience: (id) => {
    return pool.query(`SELECT * FROM experience WHERE user_id = $1`, [id]);
  },

  // insert
  insertSkill: (id, name) => {
    return pool.query(
      `INSERT INTO skills (user_id, skill_name) VALUES ($1, $2)`,
      [id, name]
    );
  },

  insertPortfolio: (data) => {
    return pool.query(
      `
    INSERT INTO portfolio (user_id, app_name, app_link, app_type, app_image)
    VALUES ($1, $2, $3, $4, $5)
    `,
      [data.id, data.name, data.link, data.type, data.file]
    );
  },

  insertExperience: (data) => {
    return pool.query(
      `
    INSERT INTO experience (user_id, position, company_name, start_date, end_date, description, company_image)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        data.id,
        data.position,
        data.company_name,
        data.start_date,
        data.end_date,
        data.description,
        data.file,
      ]
    );
  },

  // update
  editUserDetail: (data) => {
    return pool.query(
      `
    UPDATE users SET
    fullname = COALESCE($1, fullname),
    phone = COALESCE($2, phone),
    avatar = COALESCE($3, avatar),
    title = COALESCE($4, title),
    location = COALESCE($5, location),
    description = COALESCE($6, description),
    insta = COALESCE($7, insta),
    github = COALESCE($8, github),
    linkedin = COALESCE($9, linkedin)
    WHERE user_id = $10
    `,
      [
        data.fullname,
        data.phone,
        data.file,
        data.title,
        data.location,
        data.description,
        data.insta,
        data.github,
        data.linkedin,
        data.id,
      ]
    );
  },

  editPortfolio: (data) => {
    return pool.query(
      `
    UPDATE portfolio SET
    app_name = COALESCE ($1, app_name),
    app_link = COALESCE ($2, app_link),
    app_type = COALESCE ($3, app_type),
    app_image = COALESCE ($4, app_image)
    WHERE user_id = $5 AND app_id = $6
    `,
      [data.name, data.link, data.type, data.file, data.id, data.porto_id]
    );
  },

  editExperience: (data) => {
    return pool.query(
      `
    UPDATE experience SET
    company_id = COALESCE($1, company_id),
    start_date = COALESCE($2, start_date),
    end_date = COALESCE($3, end_date),
    description = COALESCE($4, description)
    WHERE user_id = $5 AND exp_id = $6
    `,
      [
        data.company_id,
        data.start,
        data.end,
        data.description,
        data.id,
        data.exp_id,
      ]
    );
  },

  // delete
  deleteSkill: (skill_id) => {
    return pool.query(`DELETE FROM skills WHERE skill_id = $1`, [skill_id]);
  },

  deletePortfolio: (porto_id) => {
    return pool.query(`DELETE FROM portfolio WHERE app_id = $1`, [porto_id]);
  },

  deleteExperience: (exp_id) => {
    return pool.query(`DELETE FROM experience WHERE exp_id = $1`, [exp_id]);
  },
};

module.exports = userModel;
