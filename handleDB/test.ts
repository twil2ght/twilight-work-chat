import {dbConfig} from "./DBconfig";
import {Pool} from "pg";
import {NodeDBHandler, ProjectionDBHandler, RelationDBHandler} from "@/src/handleDB/handler";
import {applyBatch} from "..//decorator/applyBatch";
import {NodeType} from "@/src/types";

const pool = new Pool(dbConfig);

const testN = async () => {
  const handler = new NodeDBHandler();
  let testData: string = "this is a test";
  let testDataBatch: string[] = ["this is test A", "this is test B"];
  let testId: number = 0;
  let testIDs: number[] = [];
  const decorator = applyBatch()
// 链式调用，保证顺序执行
  Promise.resolve()
      .then(async () => {
        /** CASE 1 : createData that is not existed **/
        console.log("===== 执行 CASE 1 =====");
        const res1 = (await decorator(handler.create.bind(handler))(testDataBatch))!
        testId = res1[0]?.id!;
      })
      .then(async () => {
        /** CASE 2 : createData that is existed **/
        console.log("===== 执行 CASE 2 =====");
        await handler.create(testData);
      })
      .then(async () => {
        /** CASE 3 : createData by batch **/
        console.log("===== 执行 CASE 3 =====");
        const method = decorator(handler.create.bind(handler))
        const res3 = (await method(testDataBatch))!
        testIDs = res3.map((e) => e.id);
      })
      .then(async () => {
        /** CASE 4 : queryDataById(existed) **/
        console.log("===== 执行 CASE 4 =====");
        await handler.find(testId);
      })
      .then(async () => {
        /** CASE 5 : queryDataById(not existed) **/
        console.log("===== 执行 CASE 5 =====");
        await handler.find(-1);
      })
      .then(async () => {
        /** CASE 6 : queryDataById(batch) **/
        console.log("===== 执行 CASE 6 =====");
        const method = decorator(handler.find.bind(handler))
        await method(testIDs)
      })
      .then(async () => {
        /** CASE 7 : updateDataById **/
        console.log("===== 执行 CASE 7 =====");
        await handler.update(testId, testData + "[updated]");
      })
      .then(async () => {
        /** CASE 8 : deleteDataById **/
        console.log("===== 执行 CASE 8 =====");
        await handler.delete(testId);
      })
      .catch((error) => {
        console.error("测试出错：", error);
      })
      .finally(async () => {
        await pool.end();
      });
}
const testP = async () => {
  const handler = new ProjectionDBHandler();
  let [relationId, nodeID]: number[] = [1, 500]
  let nodeIDs: number[] = [500, 1150, 502]
  let nodeType: NodeType = 'trigger'
  let projectionId: number[]
  Promise.resolve()
      .then(async () => {
        /**
         * INIT
         */
      })
      .then(async () => {
        await handler.create(relationId, nodeID, nodeType);
      })
      .then(async () => {
        /**
         * CASE 2 : create a projection(batch)
         */
        console.log("------------------")
        const method = applyBatch<1>(1)(handler.create.bind(handler))
        await method(relationId, nodeIDs, nodeType)
      })
      .then(async () => {
        /**
         * CASE 3 : query projections(by relation)
         */
        console.log("------------------")
        const result = await handler.findByR(relationId)
        projectionId = result.map(e => e.id)
      })
      .then(async () => {
        /**
         * CASE 4 : query projections(by node)
         */
        await handler.findByN(nodeID)
      })
      .then(async () => {
        /**
         * CASE 5 : delete a projection
         */
        await applyBatch()(handler.delete.bind(handler))(projectionId)
      })
}
const testR = async () => {
  const handler = new RelationDBHandler();
  let testId: number;
  Promise.resolve()
      .then(async () => {
        /**
         * CASE 1 : create a relation
         */
        const result = await handler.create()
        testId = result!.id
      })
      .then(async () => {
        /**
         * CASE 2 : delete a relation
         */
        await handler.delete(testId);
      })
}
testN().then(async()=>testR())
    .then(async()=>testP())



