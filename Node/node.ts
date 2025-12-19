import {isParalHead, Register} from "../utils";
import {Zip_C, Zip_N, Zip_R} from "../types";
import {Container} from "@/src/Container";
import {handleCreate} from "./handleCreate";
import {RPM} from "./parallelMapper";
import {handleCheck} from "./handleCheck";
import {applyBatch} from "../decorator/applyBatch";
import {debug} from "../decorator/debug";
import {useDebug} from "../globalConfig";
import {handlerN, handlerP} from "../handleDB";
import {next_tokens} from "@/src/Chat/TokenManager";
import {handleSpeak} from "@/src/Node/handleSpeak";
import {Regs} from "@/src/constants";

const token_queue = next_tokens

/**
 * @example
 * input: node 100.content: [99] me
 * node 99: {content:[98] hear}
 * node 98: {content: [97] you}
 * node 97:{content: can}
 * expected output: can you hear me
 */
async function standardize(slice: string): Promise<string> {
  const str = slice.split(" ")
  const r = await Promise.all(str.map(async e => {
    if (Regs.node.test(e)) {
      const nodeId = +e.slice(1, -1)
      return standardize((await handlerN.find(nodeId))!.val)
    } else return e
  }))
  return r.join(" ")
}
const SignAndVal = (nodeVal: string) => {
  const str = nodeVal.split(" ");
  return {sign: str[0], NVP: str.slice(1)};
}

export class Node {
  static Pool: Node[] = []

  constructor(readonly key: number,
              private readonly val: string,
              private state: boolean = false) {
  }


  @debug(useDebug)
  async register() {
    await Register<Node>(this, Node.Pool);
  }

  @debug(useDebug)
  async registerTo(pool: Node[]) {
    await Register<Node>(this, pool);
  }

  zip(): Zip_N {
    return {k: this.key, val: this.val, state: this.state};
  }

  activate(): void {
    this.state = true;
  }

  deactivate(): void {
    this.state = false;
  }

  setState(val: boolean) {
    this.state = val;
  }

  executable(): boolean {
    return this.state;
  }

  @debug(useDebug)
  async execute() {
    const {sign, NVP} = SignAndVal(this.val);
    const nv = NVP.join(" ")
    switch (sign) {
      case '[P]': {
        console.log("[P]:")
        if (!this.state) return
        const F = applyBatch()(handleCreate)
        return await F(RPM(nv, []));
      }
      case '[check]': {
        if (this.state) return
        const res = await handleCheck(RPM(nv, [])[0])
        if (res) {
          this.activate()
          console.log(`node:${this.key} has been activated:`, this.state)
        }
        return;
      }
      case '[say]': {
        handleSpeak(NVP.join(" "))
        return
      }
      case '[unknown]': {
        return
      }
      default: {
        if ((await handlerP.findByN(this.key)).length > 0) return;
        const nvf = await this.read()
        console.log("node without use:", this.key, this.val)
        for (const token of nvf.split(" ")) {
          /**
           * @[unknown] : separate from the normal token flow
           */
          token_queue.add(`[unknown] ${token}`)
        }
        return;
      }
    }
  }

  async extractR(prevC: Container[]): Promise<Zip_R[]> {
    const id_Rs = await handlerP.findByN(this.key)
    return id_Rs.filter(e => e.type === "trigger").map(e => ({
      k: e.relation_id,
      t: [],
      r: [],
      c: prevC.length > 0 ? prevC : []
    }))
  }

  /**
   * @Content: [0x01] : Hello World /
   * @private
   */
  extractP(): Zip_C | undefined {
    const str = this.val.split(" ");
    const head = str[0];
    if (isParalHead(head) && str[1] === ":") {
      return {k: head, type: "parallel", val: str.slice(2).join(" "), name: head};
    }
  }

  read() {
    return standardize(this.val);
  }
}