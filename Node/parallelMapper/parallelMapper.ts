import {Container} from "../../container";
import {isParallelSymbol} from "../../utils";
import {NodeVal} from "@/src/Node/type";
import {cutContainerToPatches} from "../utils";
import {next_tokens} from "../../Chat";

const isNext=(nodeVal:string):boolean=>{
  return nodeVal==="[next]"
}
const getNext=():NodeVal=>{
  console.log("[next] value:",next_tokens.get())
  return next_tokens.get()!
}
function parallelMapper(containers: Container[], nodeVal: NodeVal): string[] {

  const originalParts = nodeVal.split(" ");
  const processedParts = originalParts.map(part =>
      isNext(part) ? getNext() : part
  );


  const expansionRules: { index: number; options: string[] }[] = [];

  processedParts.forEach((part, index) => {
    const symbolInfo = isParallelSymbol(part);
    if (symbolInfo === "parallel") {
      const container = containers.find(c => c.zip().key === part);
      if (container) {
        const options = cutContainerToPatches(container.zip().content)
            .map(opt => opt.trim())
            .filter(opt => opt); // 过滤空字符串，避免无效选项
        if (options.length > 0) {
          expansionRules.push({ index, options });
        }
      }
    }
  });


  if (expansionRules.length === 0) {
    return [processedParts.join(" ")];
  }

  let resultNodes: string[][] = [[]];

  for (let pos = 0; pos < processedParts.length; pos++) {
    const currentPart = processedParts[pos];
    const rule = expansionRules.find(r => r.index === pos);
    const tempResults: string[][] = [];

    for (const combo of resultNodes) {

      const valuesToInsert = rule ? rule.options : [currentPart];

      for (const value of valuesToInsert) {
        tempResults.push([...combo, value]);
      }
    }
    resultNodes = tempResults;
  }


  return resultNodes.map(arr => arr.join(" "));
}

export function recursiveParallelMapper(nodeVal: NodeVal, containers: Container[]): string[] {

  const flatResults = parallelMapper(containers, nodeVal);

  const finalResults: string[] = [];

  for (const result of flatResults) {

    const containsContainer = result.split(" ").some(part => {
      const symbolInfo = isParallelSymbol(part);
      return symbolInfo !== undefined &&
          containers.some(c => c.zip().key === part);
    });

    if (!containsContainer) {

      finalResults.push(result);
    } else {

      const deeperResults = recursiveParallelMapper(result, containers);
      finalResults.push(...deeperResults);
    }
  }

  return finalResults;
}
