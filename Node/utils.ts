import {
  SPLIT_END_SIGN_CONTAINER,
  SPLIT_SIGN_FOR_CHECK,
  SPLIT_SIGN_FOR_CONTAINER,
  SPLIT_SIGN_FOR_P
} from "../Node/config";
import {NodeVal, Patches} from "../Node/type";
import {ParallelReg} from "@/src/constants";
import {nodeDBHandler} from "@/src/handleDB";
import {Container} from "../container";


/**
 * @example
 * input: node 100.content: [99] me
 * node 99: {content:[98] hear}
 * node 98: {content: [97] you}
 * node 97:{content: can}
 * expected output: can you hear me
 * @param slice
 * @param containers
 */
export async function standardize(slice: string, containers?: Container[]): Promise<string> {
  const str = slice.split(" ")
  const result = await Promise.all(str.map(async e => {
    if (ParallelReg.node.test(e)) {
      const nodeId = +e.slice(1, -1)
      const nodeVal = (await nodeDBHandler.findNodeById(nodeId))!.content
      return standardize(nodeVal)
    } else return e
  }))
  return result.join(" ")
}

export function cutContainerToPatches(containerVal: string) {
  const contentWithoutComment = containerVal.split(SPLIT_END_SIGN_CONTAINER)[0];
  return contentWithoutComment
      .split(SPLIT_SIGN_FOR_CONTAINER)
      .map(val => val.trim());
}

export const getNodeValPatches_ForP = (nodeVal: NodeVal): Patches => {
  return nodeVal.split(SPLIT_SIGN_FOR_P).map(Val => Val.trim());
}
export const getNodeValPatches_ForCheck = (nodeVal: NodeVal): Patches => {
  return nodeVal.split(SPLIT_SIGN_FOR_CHECK).map(Val => Val.trim());
}
export const getNodeVals_ForCreate = (patches: Patches): [NodeVal, NodeVal[]] => {
  return [patches[0], patches.slice(1)];
}
export const getNodeVals_ForCheck = (patches: Patches): [NodeVal, NodeVal] => {
  return [patches[0], patches[1]];
}
export const getSignAndVal = (nodeVal: NodeVal) => {
  const str = nodeVal.split(" ");
  return {sign: str[0], val: str.slice(1)};
}