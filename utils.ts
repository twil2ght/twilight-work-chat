import {ContainerType, Converter, Transformer} from "@/src/types";
import {containerVariantsNormal} from "@/src/constants";
import {Relation} from "./Relation";
import {Node} from "@/src/Node";

export function isParallelSymbol(nodeVal: string): ContainerType | undefined {
  for (const variant of containerVariantsNormal) {
    if (variant.rule.test(nodeVal)) {
      return variant.containerType
    }
  }
  return;
}
export async function Register<T extends {
  key: string | number,
}>(item: T, itemPool: T[], onSuccessCallback?: Converter): Promise<boolean> {
  if (!itemPool.some(e => e.key === item.key)) {
    itemPool.push(item);
    if (onSuccessCallback) await onSuccessCallback(item);
    return true;
  }
  console.log("register failed: Element is already existed: ",item);
  return false;
}

export async function Update<T extends {
  key: string | number,
}>(item: T, itemPool: T[], transform: Transformer): Promise<boolean> {
  let existedItem: T | undefined = itemPool.find(e => e.key === item.key)
  if (existedItem) {
    transform(existedItem, item)
    console.log("Update successful", item);
    return true;
  }
  console.log("Update failed : Can't find the Element in the Given Pool");
  return false;
}

async function showNode(n:Node){
  console.log(`ID:${n.zip().key} | Val:${n.zip().content} | State:${n.zip().isActive}`)
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
    const key=e.zip().key
    const t=e.zip().triggers
    const r=e.zip().results
    const c=e.zip().containers
    console.log(`Relation(${key}):`)
    console.log(`\tT:`)
    t.forEach(e=>showNode(e))
    console.log(`\tR:`)
    r.forEach(e=>showNode(e))
    console.log(`\tC:`)
    c.forEach(e=>{
      console.log(`ID:${e.zip().key} | Val:${e.zip().content}`)
    })
  }
}
