import {dbConfig} from "../DBconfig";
import { Pool } from "pg";
import { NodeDBHandler } from "./NodeHandler";
import {applyBatch} from "../../decorator/applyBatch";

const pool = new Pool(dbConfig);
const handler = new NodeDBHandler(pool);

let testData: string = "this is a test";
let testDataBatch: string[] = ["this is test A", "this is test B"];
let testId: number = 0;
let testIDs: number[] = [];
const decorator=applyBatch()
// 链式调用，保证顺序执行
Promise.resolve()
    .then(async () => {
      /** CASE 1 : createData that is not existed **/
      console.log("===== 执行 CASE 1 =====");
      const res1 =(await decorator(handler.createNode_DB.bind(handler))(testDataBatch))!
      testId = res1[0]?.id!;
    })
    .then(async () => {
      /** CASE 2 : createData that is existed **/
      console.log("===== 执行 CASE 2 =====");
      await handler.createNode_DB(testData);
    })
    .then(async () => {
      /** CASE 3 : createData by batch **/
      console.log("===== 执行 CASE 3 =====");
      const method=decorator(handler.createNode_DB.bind(handler))
      const res3 = (await method(testDataBatch))!
      testIDs=res3.map((e) => e.id);
    })
    .then(async () => {
      /** CASE 4 : queryDataById(existed) **/
      console.log("===== 执行 CASE 4 =====");
      await handler.findNodeById(testId);
    })
    .then(async () => {
      /** CASE 5 : queryDataById(not existed) **/
      console.log("===== 执行 CASE 5 =====");
      await handler.findNodeById(-1);
    })
    .then(async () => {
      /** CASE 6 : queryDataById(batch) **/
      console.log("===== 执行 CASE 6 =====");
      const method = decorator(handler.findNodeById.bind(handler))
      await method(testIDs)
    })
    .then(async () => {
      /** CASE 7 : updateDataById **/
      console.log("===== 执行 CASE 7 =====");
      await handler.updateNodeById(testId, testData + "[updated]");
    })
    .then(async () => {
      /** CASE 8 : deleteDataById **/
      console.log("===== 执行 CASE 8 =====");
      await handler.deleteNodeById(testId);
    })
    .catch((error) => {
      console.error("测试出错：", error);
    })
    .finally(async () => {
      await pool.end();
    });
