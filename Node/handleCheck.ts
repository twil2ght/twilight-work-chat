import {SIGN_CHECK} from "@/src/constants";
import {handlerI,handlerIN} from '@/src/handleDB'
import {log} from "@/src/utils";
const S="[any]" as const
const enum CSign{
  EQUAL='[equal]',
  IC="[IC]",
  ICN="[ICN]",
  ICID="[ICID]",
}
const nvToNvp_Check = (nv: string): string[] => {
  const r = nv.split(SIGN_CHECK).map(Val => Val.trim());
  if (r.length===2) r.push(CSign.EQUAL)
  return [r[0], r[1],r[2]];
}
const isIdentical=async (A:string,B:string):Promise<boolean> => {
  return (await handlerI.findByKV(A,B))!==undefined || (await handlerI.findByKV(A,B))!==undefined;
}
const isIdentical_N=async (A:string,B:string):Promise<boolean> => {
  return (await handlerIN.findByKV(A,B))!==undefined || (await handlerIN.findByKV(A,B))!==undefined;
}

/**
 * # 如果遇到[any]直接放行,无视check label
 *
 * @param nv
 */
export async function handleCheck(nv:string):Promise<boolean>{
  let [A,B,mode] = nvToNvp_Check(nv) as [string, string,CSign];
  [A,B]=[A.toLowerCase(),B.toLowerCase()]
  if(A=="" || B==="") return false
  if(B===S || A===S) return true
  switch (mode) {
    case CSign.EQUAL:{
      return A===B
    }
    //A belongs to B
    case CSign.IC:{
      return await isIdentical(A,B)
    }
    // A doesn't belong to B definitely
    case CSign.ICN:{
      return await isIdentical_N(A,B)
    }
    // indefinite
    case CSign.ICID:{
      return !await isIdentical(A,B) && !await isIdentical_N(A,B)
    }
    default:{
      console.log("[check] get unknown label : ",mode)
      return false
    }
  }
}
