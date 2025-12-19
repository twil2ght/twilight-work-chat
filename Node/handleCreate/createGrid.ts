import {nodeDBHandler,relationDBHandler,projectionDBHandler} from "../../handleDB";
import {NodeDBConfig} from "../../types";
import type {Index} from "../type";
import {NODE_TYPE} from "../../constants";
import {applyBatch} from "../../decorator/applyBatch";

export async function createGrid(resultVals: string[], triggerVals: string[]):Promise<Index> {
  let [triggers,results]:[NodeDBConfig[],NodeDBConfig[]]=[[],[]]
  const decorator=applyBatch()(nodeDBHandler.createNode_DB.bind(nodeDBHandler));
  await Promise.resolve().then(async()=>{

    triggers = (await decorator(triggerVals))!
  }).then(async()=>{

    results = (await decorator(resultVals) as NodeDBConfig[])!
  })
  const relation=await relationDBHandler.createRelation_DB()

  const createTriggerProjection=triggers.map(e=>projectionDBHandler.createProjection_DB(relation.id,e.id,NODE_TYPE.TRIGGER))
  const createResultProjection=results.map(e=>projectionDBHandler.createProjection_DB(relation.id,e.id,NODE_TYPE.RESULT))
  await Promise.all([...createTriggerProjection,...createResultProjection])
  return relation.id
}