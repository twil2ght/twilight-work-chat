import { Zip_R} from "../types";
import {log, Register} from "../utils";
import {Node, SignAndVal} from "../Node"
import {Container} from "../Container";
import {handlerN, handlerP} from "../handleDB";
import {TokenManager} from "@/src/Chat";

export class Relation {
  static pool: Relation[] = []
  static uuid:number=0
  key:number
  id: number

  constructor(key: number, private trigger: Node[], private result: Node[], private container: Container[]) {
    this.id = key
    this.key=Relation.uuid++
  }

  async register(prevN?:Node) {
    await Register<Relation>(this, Relation.pool, async()=>{await this.registerCallBack(prevN)})

  }

  zip(): Zip_R {
    return {k: this.id, t: this.trigger, r: this.result, c: this.container}
  }

  satisfied(): boolean {
    return this.trigger.every(t => t.executable())
  }

  isLoop():boolean{
   return this.result.some(e=>this.trigger.some(m=>m.key===e.key))
  }

  /**
   * reset the pool
   */
  async unregister() {
    Relation.pool=Relation.pool.filter(rel => rel.key !== this.key)
    if (this.satisfied()) {



      for(const e of this.trigger){
        const {sign, NVP} = SignAndVal(e.zip().val)
        if(sign==='[check]') await e.unregister()
      }
      //log.debug(`uuid:${this.key}-id:${this.id} drop his legacy`)
      //console.log(this.result,this.container)
      return {rs: this.result,cs: this.container,uuid:`uuid:${this.key}-id:${this.id}`,isLoop:this.isLoop()}
    }
  }

  private registerCallBack = async (prevN?:Node) => {
    if (this.id !== undefined) {
      const ps = await handlerP.findByR(this.id)
      const config = await Promise.all(ps.map(async (p) => {
        return {row_N: (await handlerN.find(p.node_id))!, type: p.nodetype}
      }))
      await Promise.all(config.map(async e => {
        if(e.row_N.id===prevN?.key){
          await prevN.registerTo(this[e.type]);
        }else {
          const node = new Node(e.row_N.id, e.row_N.content);
          const regCallback=await node.register()
          if(typeof(regCallback)==="boolean"){
            await node.registerTo(this[e.type]);
          }else{
           await regCallback.registerTo(this[e.type])
          }
        }
      }))
    }
  }

}