import { Zip_R} from "../types";
import {Register} from "../utils";
import {Node} from "../Node"
import {Container} from "../Container";
import {handlerN, handlerP} from "../handleDB";


export class Relation {
  static pool: Relation[] = []

  key: number

  constructor(key: number, private trigger: Node[], private result: Node[], private container: Container[]) {
    this.key = key
  }

  async register(prevN?:Node) {
    await Register<Relation>(this, Relation.pool, async()=>{await this.registerCallBack(prevN)})
  }

  zip(): Zip_R {
    return {k: this.key, t: this.trigger, r: this.result, c: this.container}
  }

  satisfied(): boolean {
    return this.trigger.every(t => t.executable())
  }

  isValid(): boolean {
    if (this.trigger.length === 0) {
      console.error("No trigger found")
      return false
    } else if (this.result.length === 0) {
      console.error("No result found")
      return false
    }
    return true
  }

  unregister() {

    if (!this.isValid()) return;
    if (!this.satisfied()) return;
    Relation.pool=Relation.pool.filter(rel => rel.key !== this.key)
    return {rs: this.result,cs: this.container}
  }

  private registerCallBack = async (prevN?:Node) => {
    if (this.key !== undefined) {
      const ps = await handlerP.findByR(this.key)
      const config = await Promise.all(ps.map(async (p) => {
        return {row_N: (await handlerN.find(p.node_id))!, type: p.type}
      }))
      await Promise.all(config.map(async e => {
        if(e.row_N.id===prevN?.key){
          await prevN.registerTo(this[e.type]);
        }else {
          const node = new Node(e.row_N.id, e.row_N.val);
          await node.register();
          await node.registerTo(this[e.type]);
        }
      }))
    }
  }

}