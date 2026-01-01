import {Pool} from 'pg';
import {LogPrintDBClass} from "../decorator/logPrintDB";
import {SQL_N, SQL_P, SQL_R} from "./sql";

import type {NodeType, Row_I, Row_N, Row_P, Row_R} from "../types";
import {dbConfig} from "./DBconfig";

const useDbLog=false

type DataTypeN = Row_N;
type DataTypeP = Row_P
type DataTypeR = Row_R;
type DataTypeI = Row_I


const P = new Pool(dbConfig);

async function run<T>(sql: string, params: any[]): Promise<T | undefined> {
  const res = await P.query(sql, params);
  return res.rows[0];
}

async function runA<T>(sql: string, params: any[]): Promise<T[]> {
  const res = await P.query(sql, params);
  return res.rows;
}

@LogPrintDBClass<DataTypeN>(useDbLog)
export class NodeDBHandler {

  constructor() {
  }

  async find(id: number): Promise<DataTypeN | undefined> {
    return await run<DataTypeN>(SQL_N.FIND, [id])
  }

  async findAll():Promise<DataTypeN[]>{
    return await runA<DataTypeN>(SQL_N.ALL,[])
  }

  async findByVal(nv: string): Promise<DataTypeN | undefined> {
    return await run<DataTypeN>(SQL_N.FIND_BY_VAL, [nv])
  }

  async update(id: number, value: string): Promise<DataTypeN | undefined> {
    return await run<DataTypeN>(SQL_N.UPDATE, [id, value])
  }

  async delete(id: number): Promise<DataTypeN | undefined> {
    return await run<DataTypeN>(SQL_N.DELETE, [id])
  }

  async create(val: string): Promise<DataTypeN | undefined> {
    return await run<DataTypeN>(SQL_N.CREATE, [val])
  }
}

@LogPrintDBClass<DataTypeP>(useDbLog)
export class ProjectionDBHandler {
  constructor() {
  }

  async create(id_R: number, id_N: number, type: NodeType): Promise<DataTypeP | undefined> {
    return await run<DataTypeP>(SQL_P.CREATE, [id_R, id_N, type])
  }

  async findByN(id: number): Promise<DataTypeP[]> {
    return await runA<DataTypeP>(SQL_P.FIND.BY_NODE, [id])
  }

  async findByR(id: number): Promise<DataTypeP[]> {
    return await runA<DataTypeP>(SQL_P.FIND.BY_RELATION, [id])
  }

  async delete(id: number): Promise<DataTypeP | undefined> {
    return await run<DataTypeP>(SQL_P.DELETE, [id])
  }
}

@LogPrintDBClass<DataTypeR>(useDbLog)
export class RelationDBHandler {
  constructor() {
  }

  async create(): Promise<DataTypeR | undefined> {
    return await run<DataTypeR>(SQL_R.CREATE, [])
  }

  async delete(id: number): Promise<DataTypeR | undefined> {
    return await run<DataTypeR>(SQL_R.DELETE, [id])
  }
}

@LogPrintDBClass<DataTypeI>(useDbLog)
export class IdentityDBHandler {
  constructor(private readonly SQL_I: {
    CREATE: string;
    DELETE: string;
    FIND:
        {
          BY_K: string;
          BY_V: string;
          BY_KV: string;
          ALL:string;
        };
    }) {}

  async create(k: string, v: string): Promise<DataTypeI | undefined> {
    return await run<DataTypeI>(this.SQL_I.CREATE, [k, v])
  }

  async delete(id: number): Promise<DataTypeI | undefined> {
    return await run<DataTypeI>(this.SQL_I.DELETE, [id])
  }

  async findByK(k: string): Promise<DataTypeI[]> {
    return await runA<DataTypeI>(this.SQL_I.FIND.BY_K, [k])
  }

  async findByV(v: string): Promise<DataTypeI[]> {
    return await runA<DataTypeI>(this.SQL_I.FIND.BY_V, [v])
  }
  async findByKV(k:string,v:string): Promise<DataTypeI | undefined> {
    return await run<DataTypeI>(this.SQL_I.FIND.BY_KV, [k, v])
  }
  async findAll():Promise<DataTypeI[]>{
    return await runA<DataTypeI>(this.SQL_I.FIND.ALL,[])
  }
}
