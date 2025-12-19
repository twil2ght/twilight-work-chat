import {Legacy} from "../chat";
import {Container} from "../../Container"
import {Relation} from "../../Relation"

async function F(data:Legacy){
  for (const e of data.rs) {
    console.log(e)
    e.activate()

    const zip_c = e.extractP()
    if (zip_c !== undefined) {
      const c = new Container(zip_c.k, zip_c.name, zip_c.type, zip_c.val)
      await c.registerTo(data.cs)
    }
  }
  for (const e of data.rs) {
    const zip_R=await e.extractR(data.cs)
    for (const e1 of zip_R) {
      const r=new Relation(e1.k,e1.t,e1.r,e1.c)
      await r.register(e)
    }

  }
}

/**
 * # 上一个relation死了，遗产(result和container)传下来，激活result，给parallel加料的节点执行一下，抽取个新parallel和relation并把遗产传给抽取的relation,新relation再注册
 * @param legacy
 */
export async function registerLegacy(legacy:Legacy[]){
  for (const e of legacy) {
    await F(e)
  }
}
