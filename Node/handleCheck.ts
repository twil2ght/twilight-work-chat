import {SIGN_CHECK} from "@/src/constants";
import {handlerI} from '@/src/handleDB'
const S="[any]" as const

const NVP_CHECK = (nv: string): string[] => {
  const r = nv.split(SIGN_CHECK).map(Val => Val.trim());
  return [r[0], r[1]];
}
const Identical=async (A:string,B:string):Promise<boolean> => {
  return (await handlerI.findByKV(A,B))!==undefined || (await handlerI.findByKV(A,B))!==undefined;
}

/**
 * # 如果遇到[any]直接放行
 *
 * @param nv
 */
export async function handleCheck(nv:string):Promise<boolean>{
  console.log("[NodeExecute]--[check]:",nv)
  const [A,B] = NVP_CHECK(nv)
  if(B===S || A===S) return true
  if(await Identical(A,B)) return true
  return A === B;
}