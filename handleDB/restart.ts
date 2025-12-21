import {SQL_INIT, SQL_RESET} from "./sql";
import {Pool} from "pg";
import {dbConfig} from "./DBconfig";

const pool = new Pool(dbConfig);

export const runResetTest = async (): Promise<void> => {
  pool.query(SQL_RESET).then(()=>{});
}
runResetTest().then(() => {});

export const runInit = async (): Promise<void> => {
  pool.query(SQL_INIT).then(()=>{});
}
//runInit().then(()=>{});
