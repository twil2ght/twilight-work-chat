import {CType} from "@/src/types";
import {CReg} from "@/src/constants";
import {Relation} from "./Relation";
import {Node} from "@/src/Node";

export function isParalHead(nv: string): CType | undefined {
  for (const variant of CReg) {
    if (variant.rule.test(nv)) {
      return variant.cType
    }
  }
  return;
}
export async function Register<T extends {
  key: string | number,
}>(item: T, itemPool: T[], callback?: any): Promise<boolean> {
  if (!itemPool.some(e => e.key === item.key)) {
    itemPool.push(item);
    if (callback) await callback(item);
    return true;
  }
  console.log("register failed: Element is already existed: ",item);
  return false;
}

export async function Update<T extends {
  key: string | number,
}>(item: T, itemPool: T[], F: any): Promise<boolean> {
  let exist: T | undefined = itemPool.find(e => e.key === item.key)
  if (exist) {
    F(exist, item)
    console.log("Update successful", item);
    return true;
  }
  console.log("Update failed : Can't find the Element in the Given Pool");
  return false;
}

async function showNode(n:Node){
  console.log(`ID:${n.zip().k} | Val:${n.zip().val} | State:${n.zip().state}`)
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
  for (const e of Relation.pool){
    const key=e.zip().k
    const t=e.zip().t
    const r=e.zip().r
    const c=e.zip().c
    console.log(`Relation(${key}):`)
    console.log(`\tT:`)
    t.forEach(e=>showNode(e))
    console.log(`\tR:`)
    r.forEach(e=>showNode(e))
    console.log(`\tC:`)
    c.forEach(e=>{
      console.log(`ID:${e.zip().k} | Val:${e.zip().val}`)
    })
  }
}
