import {dbConfig} from "../DBconfig";
import {Pool} from "pg";
import {RelationDBHandler} from "./RelationHandler";

const pool = new Pool(dbConfig);
const handler = new RelationDBHandler(pool);


let testId: number;

Promise.resolve()
    .then(async () => {
      /**
       * CASE 1 : create a relation
       */
      const result = await handler.createRelation_DB()
      testId = result.id
    })
    .then(async () => {
      /**
       * CASE 2 : delete a relation
       */
      await handler.deleteRelationById(testId);
    })
    .then(async () => {
      /**
       * CASE 3 : query all relations
       */
      await handler.getRelationsByIdGte(0)
    })