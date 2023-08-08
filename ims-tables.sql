CREATE TABLE supervisors (
  team_id BIGSERIAL NOT NULL PRIMARY KEY,
  user_id BIGINT UNIQUE NOT NULL,
  team VARCHAR(100) NOT NULL
);

CREATE TABLE users (
  user_id BIGSERIAL NOT NULL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(15) NOT NULL
);


CREATE TABLE teams (
    team_id BIGSERIAL NOT NULL PRIMARY KEY,
    team_name VARCHAR(50) NOT NULL,
    assignments TEXT[] NOT NULL,
    team_success NUMERIC(5,2)
);


CREATE TABLE interns (
    intern_id BIGSERIAL NOT NULL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    id_no VARCHAR(20) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(150) NOT NULL,
    uni VARCHAR(150),
    major VARCHAR(150),
    grade INTEGER,
    gpa NUMERIC(5,2),
    team_id BIGINT,
    birthday DATE,
    internship_starting_date DATE NOT NULL,
    internship_ending_date DATE NOT NULL,
    cv_url VARCHAR(500),
    photo_url VARCHAR(500),
    assignment_grades INTEGER[],
    overall_success INTEGER
);