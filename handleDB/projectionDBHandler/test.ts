import {dbConfig} from "../DBconfig";
import {Pool} from "pg";
import {ProjectionDBHandler} from "./ProjectionDBHandler";
import {NodeType} from "../../types";
import {applyBatch} from "../../decorator/applyBatch";

const pool = new Pool(dbConfig);
const handler = new ProjectionDBHandler(pool);

let [relationId,nodeID]: number[]=[1,500]
let nodeIDs: number[]=[500,1150,502]
let nodeType:NodeType = 'trigger'
let projectionId:number[]
Promise.resolve()
    .then(async() => {
      /**
       * INIT
       */
    })
    .then(async() => {
      await handler.createProjection_DB(relationId,nodeID,nodeType);
    })
    .then(async() => {
      /**
       * CASE 2 : create a projection(batch)
       */
      console.log("------------------")
      const method = applyBatch<1>(1)(handler.createProjection_DB.bind(handler))
      await method(relationId,nodeIDs,nodeType)
    })
    .then(async() => {
      /**
       * CASE 3 : query projections(by relation)
       */
      console.log("------------------")
      const result = await handler.queryProjectionByRelationId(relationId)
      projectionId=result.map(e=>e.id)
    })
    .then(async() => {
      /**
       * CASE 4 : query projections(by node)
       */
      await handler.queryProjectionByNodeId(nodeID)
    })
    .then(async() => {
      /**
       * CASE 5 : delete a projection
       */
      await applyBatch()(handler.deleteProjectionById.bind(handler))(projectionId)
    })