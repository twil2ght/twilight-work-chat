import {createGrid} from "./createGrid";
import {getNodeVals_ForCreate, getNodeValPatches_ForP} from "../utils";
import type {Index} from "../type";

export async function handleCreate(nodeVal:string):Promise<Index>{
  const [result,triggers] = getNodeVals_ForCreate(getNodeValPatches_ForP(nodeVal));
  return createGrid([result],triggers)
}