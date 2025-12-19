const dbConfigTest = {
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "gg",
  port: 5432,
};
const dbConfigMain = {
  user: "twilight",
  host: "localhost",
  database: "twilight",
  password: "gg",
  port: 5432,
};

const isTest = true

export const dbConfig = isTest ? dbConfigTest : dbConfigMain