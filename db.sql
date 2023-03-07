CREATE DATABASE peworld;

CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    fullname VARCHAR(32) NOT NULL,
    email VARCHAR(64) NOT NULL,
    phone VARCHAR(16) NOT NULL,
    password VARCHAR(64) NOT NULL,
    avatar VARCHAR(256),
    title VARCHAR(32),
    location VARCHAR(32),
    description VARCHAR,
    insta VARCHAR(32),
    github VARCHAR(32),
    linkedin VARCHAR(32)
);

CREATE TABLE companies (
    company_id UUID PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    email VARCHAR(64) NOT NULL,
    phone VARCHAR(16) NOT NULL,
    password VARCHAR(64) NOT NULL,
    logo VARCHAR(256),
    background VARCHAR(256),
    area VARCHAR(32),
    location VARCHAR(32),
    description VARCHAR,
    insta VARCHAR(32),
    linkedin VARCHAR(32)
);

CREATE TABLE skills (
    skill_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES users(user_id),
    skill_name VARCHAR(32)
);

CREATE TABLE portfolio (
    app_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES users(user_id),
    app_name VARCHAR(64),
    app_link VARCHAR,
    app_type BOOLEAN,
    app_image VARCHAR(256)
);

CREATE TABLE experience (
    exp_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES users(user_id),
    porition VARCHAR(255),
    company_name VARCHAR(255),
    start_date VARCHAR,
    end_date VARCHAR,
    description VARCHAR,
    company_image VARCHAR(255)
);

CREATE TABLE offers (
    offer_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    comp_id UUID REFERENCES companies(company_id),
    offer_type BOOLEAN NOT NULL,
    cp_name VARCHAR(32) NOT NULL,
    cp_email VARCHAR(64) NOT NULL,
    cp_phone VARCHAR(16) NOT NULL,
    description VARCHAR,
    status BOOLEAN DEFAULT FALSE
);
