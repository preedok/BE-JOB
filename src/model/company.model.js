const pool = require("../config/db");

const companyModel = {
  // auth
  register: ({ id, name, email, phone, hashedPassword }) => {
    return pool.query(
      `
            INSERT INTO companies (company_id, name, email, phone, password)
            VALUES ($1, $2, $3, $4, $5)
            `,
      [id, name, email, phone, hashedPassword]
    );
  },

  mailCheck: (email) => {
    return pool.query(`SELECT * FROM companies WHERE email = $1`, [email]);
  },

  // profile
  getCompany: () => {
    return pool.query(`SELECT * FROM companies`);
  },

  getCompanyDetail: (id) => {
    return pool.query(`SELECT * FROM companies WHERE company_id = $1`, [id]);
  },

  // home
  getUserList: (search, sortBy, sortOrder, limit, offset) => {
    return pool.query(`SELECT * FROM users WHERE (fullname ILIKE '%${search}%' OR title ILIKE '%${search}%') 
    ORDER BY ${sortBy} ${sortOrder} LIMIT ${limit} OFFSET ${offset}`);
  },

  countUser: () => {
    return pool.query("SELECT COUNT(*) AS total FROM users");
  },

  // update
  editCompanyDetail: ({
    id,
    name,
    area,
    location,
    description,
    insta,
    linkedin,
    file,
  }) => {
    return pool.query(
      `
    UPDATE companies SET
    name = COALESCE($1, name),   
    area = COALESCE($2, area),   
    location = COALESCE($3, location),   
    description = COALESCE($4, description),   
    insta = COALESCE($5, insta),   
    linkedin = COALESCE($6, linkedin),   
    logo = COALESCE($7, logo)
    WHERE company_id = $8 
  `,
      [name, area, location, description, insta, linkedin, file, id]
    );
  },
};

module.exports = companyModel;
