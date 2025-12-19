import {Legacy} from "../chat";
import {Container} from "../../container"
import {Relation} from "../../Relation"
/*import {chatInit} from "./init";
import {chatExToken_In} from "./ex_token_in";
import {unregisterRelation} from "./unregisterRelation";
chatInit().then(()=>{
  chatExToken_In().then(()=>{})
}).then(async ()=>{
  const legacy=unregisterRelation()
  legacy.forEach(r=>{
    r.result.forEach(re=>{
      console.log(re.zip())
    })
    r.container.forEach(re=>{
      console.log(re.zip())
    })
  })
  await register_legacy(legacy)
})*/
async function handleSingle(data:Legacy){
  for (const e of data.result) {
    console.log(e)
    e.activate()

    const config_Parallel = e.extractParallel()
    if (config_Parallel !== undefined) {
      const container = new Container(config_Parallel.key, config_Parallel.name, config_Parallel.type, config_Parallel.content)
      await container.registerTo(data.container)
    }
  }
  for (const e of data.result) {
    const config_relation=await e.extractRelation(data.container)
    for (const e1 of config_relation) {
      const newRelation=new Relation(e1.key,e1.triggers,e1.results,e1.containers)
      await newRelation.register(e)
    }

  }
}

/**
 * # 上一个relation死了，遗产(result和container)传下来，激活result，给parallel加料的节点执行一下，抽取个新parallel和relation并把遗产传给抽取的relation,新relation再注册
 * @param legacy
 */
export async function register_legacy(legacy:Legacy[]){
  for (const e of legacy) {
    await handleSingle(e)
  }
}
