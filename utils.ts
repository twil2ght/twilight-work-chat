import {Regs, SIGN_C_END} from "@/src/constants";
import {handlerN} from "@/src/handleDB";

export function isParallelHead(str: string): boolean {
  return Regs.parallel.test(str)
}
export const isNodeHead=(str:string)=>{
  return Regs.node.test(str)
}
export const isIGet=(str:string)=>{
  return Regs.iGet.test(str)
}
export const isIGetContainer=(nvp:string[])=>{
  return isIGet(nvp[2]) && nvp[3]===SIGN_C_END
}
export const getBracketVal=(str:string)=>{
  return str.slice(1,str.length-1)
}
export async function strToNv(str:string,print:boolean=false,strict=true){
  let targetedN;
  let S=str.split(" ")
  let prevNId="";
  for (const e of S){
    const N=strict?await handlerN.findByVal(prevNId+e):await handlerN.create(prevNId+e)
    console.assert(!!N,"[Utils->strToNV]: failed")
    targetedN=N
    if(print)console.log(`[utils->strToNv]:${N?.content}`)
    prevNId=`[${N!.id}] `
  }

  //console.log(`[utils->strToNv](Final):${targetedN?.content}`)
  return targetedN
}
/**
 * 分割字符串：仅分割花括号外部的空格，保留花括号内部的空格
 * @param str 包含花括号和空格的目标字符串
 * @returns 分割后的字符串数组
 */
export function splitIgnoreBraceSpace(str: string): string[] {
  const result: string[] = [];
  let currentSegment = '';
  let braceCount = 0; // 花括号计数器：0=外部，>0=内部

  // 遍历每个字符
  for (const char of str) {
    // 处理花括号，更新计数器
    if (char === '{') {
      braceCount++;
      currentSegment += char;
    } else if (char === '}') {
      // 防止计数器为负数（处理不闭合的花括号）
      braceCount = Math.max(0, braceCount - 1);
      currentSegment += char;
    }
    // 处理空格：仅在花括号外部时分割
    else if (char === ' ' && braceCount === 0) {
      // 跳过连续的空格（避免空字符串元素）
      if (currentSegment) {
        result.push(currentSegment);
        currentSegment = '';
      }
    }
    // 其他字符：直接追加到当前片段
    else {
      currentSegment += char;
    }
  }

  // 把最后一个非空片段加入结果
  if (currentSegment) {
    result.push(currentSegment);
  }

  return result;
}

export async function Register<T extends {
  key: string | number,
}>(item: T, itemPool: T[], callback?: any,repeatable:boolean=false): Promise<undefined | T> {
  if(repeatable) {
    itemPool.push(item);
    return
  }
  let exist: T | undefined = itemPool.find(e => e.key === item.key)
  if (callback) await callback(item);

  if (exist) {
    return exist
  }else{
    //if(item.key===1049) console.log("what can i say",item)
    itemPool.push(item)
    return
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
