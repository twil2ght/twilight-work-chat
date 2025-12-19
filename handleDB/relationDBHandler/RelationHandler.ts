import { Pool } from "pg";
import type { RelationDBConfig } from "../../types";
import { LogPrintDB } from "../../decorator/logPrintDB";
import { RELATION_SQL } from "./sql";

type dataType = RelationDBConfig;
import {useDbLog} from "@/src/config";
export class RelationDBHandler {
  constructor(private readonly pool: Pool) {}

  @LogPrintDB<dataType>(useDbLog)
  async createRelation_DB(): Promise<dataType> {
    const result = await this.pool.query(RELATION_SQL.CREATE);
    return result.rows[0];
  }

  @LogPrintDB<dataType>(useDbLog)
  async deleteRelationById(id: number): Promise<dataType | undefined> {
    const result = await this.pool.query(RELATION_SQL.DELETE, [id]);
    return result.rows[0];
  }

  @LogPrintDB<dataType>(useDbLog)
  async getRelationsByIdGte(minId: number): Promise<dataType[]> {
    const query = `
        SELECT *
        FROM relations
        WHERE id >= $1`;
    const result = await this.pool.query(query, [minId]);
    return result.rows;
  }
}