import {Legacy} from "../chat";
import {Container} from "../../Container"
import {Relation} from "../../Relation"
import {createNodesByVal, Node} from "@/src/Node";
import {log} from "@/src/utils";
import {TokenManager} from "@/src/Chat";

const isEnd=()=>{
  return TokenManager.getHistory().slice(-1)[0]==='//'
}

const legacy_activate=(results:Node[])=>{
  results.forEach(e=>e.tryActivate())
}

const legacy_extractP=async (results:Node[],containers:Container[])=>{
  let failed_N_withP:string[]=[]
  await Promise.all(results.map(async e => {
    //console.log("\t[DoLegacy->extractP]:", e.zip().val)
    const res = await e.execute(containers, ['[P]','[say]','[unknown]','[Q]','[I]'])
    if(res){failed_N_withP=[...failed_N_withP,...res]}
    const zip_c = e.extractP()
    if (zip_c !== undefined) {
      const c = new Container(zip_c.k, zip_c.val)
      await c.registerTo(containers)
    }
  }))
  return failed_N_withP
}
const legacy_extractR=async (results:Node[],containers:Container[])=>{
  await Promise.all(results.map(async e => {
    const zip_R=await e.extractR(containers)
    if(zip_R==undefined) return
    //console.log("\t[DoLegacy->extractR]:",e.zip().val)
    for (const e1 of zip_R) {
      const r=new Relation(e1.k,e1.t,e1.r,e1.c)
      await r.register(e)
      //console.log("\tzip_R:",e1)
    }
  }))
}
async function F(legacy:Legacy){
  //log.debug(`[Legacy From]:${legacy.uuid}`)
  legacy_activate(legacy.rs)
  const paralNodesFailed=await legacy_extractP(legacy.rs,legacy.cs)
  const nodesFromFailed=await createNodesByVal(paralNodesFailed)
  await legacy_extractR(legacy.rs,legacy.cs)
  await legacy_extractR(nodesFromFailed,[])
  //console.log("-----------------------------------------------------")
}

/**
 * 上一个relation死了，遗产(result和container)传下来，激活result，给parallel加料的节点执行一下，抽取个新parallel和relation并把遗产传给抽取的relation,新relation再注册
 * @param legacy
 */
export async function registerLegacy(legacy: Legacy[]) {
  for (const e of legacy) {
    if(e.isLoop && isEnd()) continue
    e.cs = e.cs.map(container => container.clone());
    await F(e);
  }
}
