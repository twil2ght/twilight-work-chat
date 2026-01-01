import { Zip_R} from "../types";
import {Register} from "../utils";
import {Node, createObjNodesByVal, SignAndVal} from "../Node"
import {Container} from "../Container";
import {handlerN, handlerP} from "../handleDB";
import {RPM} from "@/src/Node/parallelMapper";

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

  async satisfied(): Promise<boolean> {
    for (const t of this.trigger) {
      const isExecutable = await t.executable();
      if (!isExecutable) {
        return false;
      }
    }
    return true;
  }

  isLoop():boolean{
   return this.result.some(e=>this.trigger.some(m=>m.key===e.key))
  }

  /**
   * reset the pool
   */
  async drop() {
    Relation.pool=Relation.pool.filter(rel => rel.key !== this.key)
    //if(this.id===121)console.log("MAN!!!!!!!!!!!!!",this)
    if (await this.satisfied()) {



      for(const e of this.trigger){
        const {sign,NVP} = SignAndVal(e.zip().val)
        if(sign==='[check]') await e.drop()
      }
      //log.debug(`uuid:${this.key}-id:${this.id} drop his legacy`)

      return {rs: this.result,cs: this.container,uuid:`uuid:${this.key}-id:${this.id}`,isLoop:this.isLoop()}
    }
  }

  /**
   * @example: unpacking
   * triggerA : [0x01] => fruit ([0x01]: apple,pear)
   * After unpacking : triggerA-> [trigger1: apple => fruit; trigger2: pear => fruit]
   * @param prevN
   */
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
          let nodes:Node[];
          const specificNodeVals = RPM(e.row_N.content,this.container)

          if(specificNodeVals && e.type==='trigger' && e.row_N.content.indexOf('[next]')===-1){

            nodes = await createObjNodesByVal(specificNodeVals)
          }else{
            nodes = [new Node(e.row_N.id, e.row_N.content)];
          }
          await Promise.all(nodes.map(async node=>{
            const regCallback=await node.register()
            if(!regCallback){
              await node.registerTo(this[e.type]);
            }else{
              await regCallback.registerTo(this[e.type])
            }
          }))
         // if(this.id===39) console.log("RELATION:",e.row_N.content,specificNodeVals)
        }
      }))
    }
    if(this.id===941) console.log("RELATION-trigger:",this)
  }

}