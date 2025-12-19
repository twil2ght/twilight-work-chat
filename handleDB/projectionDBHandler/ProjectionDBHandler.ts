import { Pool } from "pg";
import { LogPrintDB } from "../../decorator/logPrintDB";
import type { ProjectionDBConfig,NodeType } from "../../types";
import { PROJECTION_CRUD_SQL } from "./sql";
import {useDbLog} from "@/src/config";
type dataType = ProjectionDBConfig;

export class ProjectionDBHandler {
  constructor(private readonly pool: Pool) {}

  @LogPrintDB<dataType>(useDbLog)
  async createProjection_DB(relationID: number, nodeID: number, type: NodeType): Promise<dataType> {
    const result = await this.pool.query(PROJECTION_CRUD_SQL.CREATE, [relationID, nodeID, type]);
    return result.rows[0];
  }

  @LogPrintDB<dataType>(useDbLog)
  async queryProjectionByNodeId(id: number): Promise<dataType[]> {
    const result = await this.pool.query(PROJECTION_CRUD_SQL.FIND.BY_NODE, [id]);
    return result.rows;
  }

  @LogPrintDB<dataType>(useDbLog)
  async queryProjectionByRelationId(id: number): Promise<dataType[]> {
    const result = await this.pool.query(PROJECTION_CRUD_SQL.FIND.BY_RELATION, [id]);
    return result.rows;
  }

  @LogPrintDB<dataType>(useDbLog)
  async deleteProjectionById(id:number): Promise<dataType | undefined> {
    const result = await this.pool.query(PROJECTION_CRUD_SQL.DELETE, [id]);
    return result.rows[0];
  }
}