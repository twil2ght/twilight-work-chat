interface DBConfig{
  user: string,
  host: string,
  database: string,
  password: string,
  port: number,
}
const test = {
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "gg",
  port: 5432,
};
const main = {
  user: "twilight",
  host: "localhost",
  database: "twilight",
  password: "gg",
  port: 5432,
};

const isTest = true

export const dbConfig:DBConfig = isTest ? test : main