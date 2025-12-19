import { Pool } from 'pg';
import type { NodeDBConfig } from "../../types";
import { LogPrintDB } from "../../decorator/logPrintDB";
import { NODE_CRUD_SQL } from "./sql";
import {useDbLog} from "@/src/config";

type dataType = NodeDBConfig;

export class NodeDBHandler {

  constructor(private readonly pool: Pool) {}


  @LogPrintDB<dataType>(useDbLog)
  async findNodeById(id: number): Promise<dataType | undefined> {
    const result = await this.pool.query(NODE_CRUD_SQL.FIND, [id]);
    return result.rows[0];
  }
  @LogPrintDB<dataType>(useDbLog)
  async findNodeByVal(nodeVal:string):Promise<dataType | undefined> {
    const query=`SELECT id,content,created_at FROM nodes WHERE content = $1;`
    const result = await this.pool.query(query, [nodeVal]);
    return result.rows[0];
  }

  @LogPrintDB<dataType>(useDbLog)
  async updateNodeById(id: number, value: string): Promise<dataType | undefined> {
    const result = await this.pool.query(NODE_CRUD_SQL.UPDATE, [value, id]);
    return result.rows[0];
  }

  @LogPrintDB<dataType>(useDbLog)
  async deleteNodeById(id: number): Promise<dataType | undefined> {
    const result = await this.pool.query(NODE_CRUD_SQL.DELETE, [id]);
    return result.rows[0];
  }

  @LogPrintDB<dataType>(useDbLog)
  async createNode_DB(value: string): Promise<dataType | undefined> {
    const result = await this.pool.query(NODE_CRUD_SQL.CREATE, [value]);
    return result.rows[0];
  }
}