import {ContainerConfig, Converter, RelationConfig} from "../types";
import {Register} from "../utils";
import {Node} from "../Node"
import {Container} from "../container";
import {nodeDBHandler, projectionDBHandler} from "../handleDB";



export class Relation {
  static pool: Relation[] = []

  key: number

  constructor(key: number, private trigger: Node[], private result: Node[], private container: Container[]) {
    this.key = key
  }

  async register(pn?:Node) {
    await Register<Relation>(this, Relation.pool, async()=>{await this.registerCallback(pn)})
  }

  zip(): RelationConfig {
    return {key: this.key, triggers: this.trigger, results: this.result, containers: this.container}
  }

  isAllTriggersReady(): boolean {
    return this.trigger.every(trigger => trigger.executable())
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
    if (!this.isAllTriggersReady()) return;
    Relation.pool=Relation.pool.filter(rel => rel.key !== this.key)
    return {result: this.result,container: this.container}
  }

  private registerCallback: Converter = async (pn?:Node) => {
    if (this.key !== undefined) {
      const projections = await projectionDBHandler.queryProjectionByRelationId(this.key)
      const config = await Promise.all(projections.map(async (projection) => {
        return {val: (await nodeDBHandler.findNodeById(projection.node_id))!, type: projection.nodetype}
      }))
      await Promise.all(config.map(async e => {
        if(e.val.id===pn?.key){
          await pn.registerTo(this[e.type]);
        }else {
          const node = new Node(e.val.id, e.val.content);
          await node.register();
          await node.registerTo(this[e.type]);
          const res: ContainerConfig | undefined = node.extractParallel()
          if (res !== undefined) {
            const parallel = new Container(res.key, res.name, res.type, res.content)
            await parallel.registerTo(this.container)
          }
        }
      }))
    }
  }

}