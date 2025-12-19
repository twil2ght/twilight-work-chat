import {isParallelSymbol, Register} from "../utils";
import {ContainerConfig, NodeConfig, RelationConfig} from "../types";
import {Container} from "@/src/container/container";
import {getSignAndVal, standardize} from "./utils";
import {handleCreate} from "./handleCreate/handleCreate";
import {recursiveParallelMapper} from "./parallelMapper/parallelMapper";
import {handleCheck} from "./handleCheck/handleCheck";
import {applyBatch} from "../decorator/applyBatch";
import {debug} from "../decorator/debug";
import {useDebug} from "../config";
import {projectionDBHandler} from "../handleDB";
import { next_tokens } from "@/src/Chat/TokenManager";

const token_queue=next_tokens

export class Node {
  static Pool: Node[] = []

  constructor(readonly key: number,
              private readonly content: string,
              private isActive: boolean = false) {
  }


  @debug(useDebug)
  async register() {
    await Register<Node>(this, Node.Pool);
  }

  @debug(useDebug)
  async registerTo(pool: Node[]) {
    await Register<Node>(this, pool);
  }

  zip(): NodeConfig {
    return {key: this.key, content: this.content, isActive: this.isActive};
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  setState(val: boolean) {
    this.isActive = val;
  }

  executable(): boolean {
    return this.isActive;
  }

  @debug(useDebug)
  async execute() {
    const {sign, val} = getSignAndVal(this.content);
    const nodeVal = val.join(" ")
    switch (sign) {
      case '[P]': {
        console.log("[P]:")
        if (!this.isActive) return
        const decorator_Fn = applyBatch()(handleCreate)
        return await decorator_Fn(recursiveParallelMapper(nodeVal, []));
      }
      case '[check]': {
        if(this.isActive) return
        const res = await handleCheck(recursiveParallelMapper(nodeVal, [])[0])
        if (res) {
          this.activate()
          console.log(`node:${this.key} has been activated:`,this.isActive)
        }
        return;
      }
      case '[say':{

        return
      }
      case '[unknown]': {
        return
      }
      default:{
        if((await projectionDBHandler.queryProjectionByNodeId(this.key)).length>0) return;
        const unknownDataInput=await this.read()
        console.log("node without use:",this.key,this.content)
            for (const token of unknownDataInput.split(" ")){
              /**
               * @[unknown] : separate from the normal token flow
               */
              token_queue.add(`[unknown] ${token}`)
            }
        return;
      }
    }
  }

  async extractRelation(prevContainers: Container[]): Promise<RelationConfig[]> {
    const relationIds = await projectionDBHandler.queryProjectionByNodeId(this.key)
    return relationIds.filter(e=>e.nodetype==="trigger").map(e => ({
      key: e.relation_id,
      triggers: [],
      results: [],
      containers: prevContainers.length > 0 ? prevContainers : []
    }))
  }

  /**
   * @Content: [0x01] : Hello World /
   * @private
   */
  extractParallel(): ContainerConfig | undefined {
    const str = this.content.split(" ");
    const firstPart = str[0];
    if (isParallelSymbol(firstPart) && str[1] === ":") {
      return {key: firstPart, type: "parallel", content: str.slice(2).join(" "), name: firstPart};
    }
  }

  read() {
    return standardize(this.content, []);
  }
}