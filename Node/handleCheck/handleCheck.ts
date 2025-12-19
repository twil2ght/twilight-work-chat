import {NodeVal} from "../type";
import {getNodeValPatches_ForCheck, getNodeVals_ForCheck} from "../utils";

export async function handleCheck(nodeVal:NodeVal):Promise<boolean>{
  console.log("[NodeExecute]--[check]:",nodeVal)
  const [partA,partB] = getNodeVals_ForCheck(getNodeValPatches_ForCheck(nodeVal))

  return partA === partB;
}