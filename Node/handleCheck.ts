import {SIGN_CHECK} from "@/src/constants";
import {handlerI,handlerIN} from '@/src/handleDB'
import {isIGet} from "@/src/utils";
const ANY="[any]" as const
const enum CSign{
  EQUAL='[equal]',
  I="[I]",
  IN="[IN]",
  UNK="[UNK]",
  I_GET="[IGET]",
  I_GET_N="[IGET_N]"
}
const parseNV = (nv: string): string[] => {
  const r = nv.split(SIGN_CHECK).map(Val => Val.trim());
  if (r.length===2) r.push(CSign.EQUAL)
  return [r[0].toLowerCase(), r[1].toLowerCase(),r[2]];
}
const isLinked=async (A:string,B:string):Promise<boolean> => {
  return (await handlerI.findByKV(B,A))!==undefined;
}
const isNotLinked=async (A:string,B:string):Promise<boolean> => {
  return (await handlerIN.findByKV(A,B))!==undefined || (await handlerIN.findByKV(A,B))!==undefined;
}
export const getValByKey_I=async (key:string)=>{
  if (!isIGet(key)) return
  const k:string=key.slice(1,key.length-1)
  return (await handlerI.findByK(k))
}
/**
 * if [any] return true
 *
 * @param nv
 */
export async function handleCheck(nv:string):Promise<boolean>{

  let [A,B,mode] = parseNV(nv) as [string, string,CSign];

  if(A=="" || B==="") return false

  if(B===ANY || A===ANY) return true

  switch (mode) {
    case CSign.EQUAL:{
      return A===B || (await isLinked(A,B) && await isLinked(B,A))
    }
    //A belongs to B
    case CSign.I:{
      return await isLinked(A,B)
    }
    // A doesn't belong to B definitely
    case CSign.IN:{
      return await isNotLinked(A,B)
    }
    // indefinite
    case CSign.UNK:{
      return !await isLinked(A,B) && !await isNotLinked(A,B)
    }
    case CSign.I_GET:{
      const res= await getValByKey_I(A)
      return !!res
    }
    case CSign.I_GET_N:{
     const res= await getValByKey_I(A)
      return !res
    }
    default:{
      console.log("[check] get unknown label : ",mode)
      return false
    }
  }
}
