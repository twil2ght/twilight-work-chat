import {NodeDBHandler} from "./nodeDBHandler/NodeHandler";
import {RelationDBHandler} from "./relationDBHandler/RelationHandler";
import {ProjectionDBHandler} from "./projectionDBHandler/ProjectionDBHandler";
import {dbConfig} from "./DBconfig";
import {Pool} from "pg";

const pool = new Pool(dbConfig);
export const [nodeDBHandler,relationDBHandler,projectionDBHandler] = [new NodeDBHandler(pool),new RelationDBHandler(pool),new ProjectionDBHandler(pool)];

