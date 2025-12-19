import {INIT_DB_SQL} from "./initSQL";
import {Pool} from "pg";
import {dbConfig} from "../DBconfig";
const pool = new Pool(dbConfig);

export const runInit = async (): Promise<void> => {
  pool.query(INIT_DB_SQL).then(()=>{});
}
