import {Container} from "../Container";
import {isParallelHead} from "../utils";
import {TokenManager} from "@/src/Chat/TokenManager";
import {SIGN_C_END, SIGN_C} from "@/src/constants";

const isNext=(nv:string):boolean=>{
  return nv==="[next]"
}
const getNext=():string=>{
  return TokenManager.get()!
}


function toPatches(cv: string) {
  const cvf = cv.split(SIGN_C_END)[0];
  return cvf
      .split(SIGN_C)
      .map(val => val.trim());
}
function parallelMapper(cs: Container[], nv: string,strict=false): string[] | undefined {

  const nvp = nv.split(" ");
  const processedNvp = nvp.map(e =>
      isNext(e) ? getNext() : e
  );


  const rules: { index: number; options: string[] }[] = [];

  let end=false
  processedNvp.forEach((e, index) => {
    const sign = isParallelHead(e);
    if (sign) {
      const c = cs.find(c => c.zip().k === e);
      if(c===undefined){
        if(strict) end=true
      }
      else if(!c.executable()){
        end=true
      }
      if (c && c.executable()) {
        const options = toPatches(c.zip().val)
            .map(opt => opt.trim())
            .filter(opt => opt); // 过滤空字符串，避免无效选项
        if (options.length > 0) {
          rules.push({ index, options });
        }
      }
    }
  });

  if(end) return


  if (rules.length === 0) {
    return [processedNvp.join(" ")];
  }

  let resultNodes: string[][] = [[]];

  for (let pos = 0; pos < processedNvp.length; pos++) {
    const currentPart = processedNvp[pos];
    const rule = rules.find(r => r.index === pos);
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

export function RPM(nv: string, cs: Container[],strict=false): string[] | undefined {

  const flatResults = parallelMapper(cs, nv,strict);
  if(!(flatResults)) return

  const finalResults: string[] = [];

  for (const res of flatResults) {

    const hasC = res.split(" ").some(e => {
      const sign = isParallelHead(e);
      return sign &&
          cs.some(c => c.zip().k === e);
    });

    if (!hasC) {

      finalResults.push(res);
    } else {

      const deeperResults = RPM(res, cs);
      if(!(deeperResults)) return
      finalResults.push(...deeperResults);
    }
  }

  return finalResults;
}