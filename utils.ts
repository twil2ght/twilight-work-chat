import {CReg} from "@/src/constants";
import {Relation} from "./Relation";
import {Node} from "@/src/Node";
import {handlerN} from "@/src/handleDB";

export function isParalHead(nv: string): boolean {
  return CReg[0].rule.test(nv)
}

export async function strToNv(str:string,print:boolean=false){
  let targetedN;
  const H="boss to [GG] :"
  let S=str.split(" ")
  if(S.indexOf(":")!==3){
    S=(H+" "+str).split(" ")
  }
  let prevNId="";
  for (const e of S){
    const N=await handlerN.create(prevNId+e)
    targetedN=N
    if(print)console.log(`[utils->strToNv]:${N?.content}`)
    prevNId=`[${N!.id}] `
  }
  //console.log(`[utils->strToNv](Final):${targetedN?.content}`)
  return targetedN
}

export async function Register<T extends {
  key: string | number,
}>(item: T, itemPool: T[], callback?: any,repeatable:boolean=false): Promise<boolean | T> {
  if(repeatable) {
    itemPool.push(item);
    return true;
  }
  let exist: T | undefined = itemPool.find(e => e.key === item.key)
  if (callback) await callback(item);
  if (exist) {
    return exist
  }else{
    itemPool.push(item)
    return true
  }
}

export async function Update<T extends {
  key: string | number,
}>(item: T, itemPool: T[], F: any): Promise<boolean> {
  let exist: T | undefined = itemPool.find(e => e.key === item.key)
  if (exist) {
    F(exist, item)

    return true;
  }
  console.log("Update failed : Can't find the Element in the Given Pool");
  return false;
}

async function showNode(n:Node){
  console.log(`\tID:${n.zip().k} | Val:${n.zip().val} | State:${n.zip().state}`)
}


/**
 * # Relation(out):
 * Relation(new):
 * Relation(all now):
 */
export async function showcase():Promise<void>{
  /**
   * Relation(id):
   *    triggers:
   *    results:
   *    containers:
   */
/*  for (const e of Relation.pool){
    const key=e.zip().k
    const t=e.zip().t
    const r=e.zip().r
    const c=e.zip().c
    console.log(`Relation(${key},${e.key}):`)
    console.log(`\tT:`)
    t.forEach(e=>showNode(e))
    console.log(``)
    console.log(`\tR:`)
    r.forEach(e=>showNode(e))
    console.log(``)
    console.log(`\tC:`)
    c.forEach(e=>{
      console.log(`\tID:${e.zip().k} | Val:${e.zip().val}`)
    })
  }*/
  console.groupCollapsed(Relation.pool)
}
// utils/colorLog.ts
// Node.js终端颜色码（前端浏览器可忽略，只适用于Node环境）
export const Color = {
  // 字体颜色
  red: "\x1b[31m",    // 错误/异常
  green: "\x1b[32m",  // 成功/完成
  yellow: "\x1b[33m", // 警告/注意
  blue: "\x1b[34m",   // 信息/流程
  cyan: "\x1b[36m",   // 调试/详情
  gray: "\x1b[90m",   // 次要/分隔符
  reset: "\x1b[0m",   // 重置为默认白色（必须加，否则后续日志都会变色）
};

/**
 * 带颜色的日志打印（极简版）
 * @param color 颜色（从Color对象取）
 * @param prefix 日志前缀（如[chat] [Node]）
 * @param message 日志内容
 */
export const colorLog = (color: string, prefix: string, message: string) => {
  console.log(`${color}${prefix} ${message}${Color.reset}`);
};

// 快捷方法（不用每次传颜色，直接调用）
export const log = {
  info: (prefix: string, msg: string='') => colorLog(Color.blue, prefix, msg),    // 蓝色：普通信息
  warn: (prefix: string, msg: string='') => colorLog(Color.yellow, prefix, msg), // 黄色：警告
  error: (prefix: string, msg: string='') => colorLog(Color.red, prefix, msg),   // 红色：错误
  success: (prefix: string, msg: string='') => colorLog(Color.green, prefix, msg),// 绿色：成功
  debug: (prefix: string, msg: string='') => colorLog(Color.cyan, prefix, msg),  // 青色：调试详情
  gray: (prefix: string, msg: string='') => colorLog(Color.gray, prefix, msg),   // 灰色：分隔符/次要信息
};
