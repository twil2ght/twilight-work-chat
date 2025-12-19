import {RESET_TEST_DB_SQL} from "./resetSQL";
import {Pool} from "pg";
import {dbConfig} from "../DBconfig";
const pool = new Pool(dbConfig);
export const runResetTest = async (): Promise<void> => {
  pool.query(RESET_TEST_DB_SQL).then(()=>{});
}
runResetTest().then(() => {});