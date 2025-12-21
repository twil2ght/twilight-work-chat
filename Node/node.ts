import {isParalHead, log, Register} from "../utils";
import {Zip_C, Zip_N, Zip_R} from "../types";
import {Container} from "@/src/Container";
import {RPM} from "./parallelMapper";
import {handleCheck} from "./handleCheck";
import {applyBatch} from "../decorator/applyBatch";
import {handlerN, handlerP} from "../handleDB";
import {TokenManager} from "@/src/Chat";
import {handleSpeak} from "@/src/Node/handleSpeak";
import {Regs} from "@/src/constants";
import {guessDataV2} from "@/src/data/metaLoader";
import {handleIdentity} from "@/src/Node/handleIdentity";

type Sign = '[P]' | '[check]' | '[say]' | '[unknown]' | '[Q]' | '[I]'
const payloadArrow='->'

/**
 * @example
 * input: node 100.content: [99] me
 * node 99: {content:[98] hear}
 * node 98: {content: [97] you}
 * node 97:{content: can}
 * expected output: can you hear me
 */
async function nvToStr(slice: string): Promise<string> {
  const str = slice.split(" ")
  const r = await Promise.all(str.map(async e => {
    if (Regs.node.test(e)) {
      const nodeId = +e.slice(1, -1)
      return nvToStr((await handlerN.find(nodeId))!.content)
    } else return e
  }))
  return r.join(" ")
}


export const SignAndVal = (nodeVal: string) => {
  const str = nodeVal.split(" ");
  return {sign: str[0], NVP: str.slice(1)};
}

export async function createNodesByVal(val:string[]){
  let F=applyBatch()(handlerN.create.bind(handlerN))
  let row=await F(val)
  return row!.map(e=>new Node(e.id,e.content))
}

export class Node {
  static Pool: Node[] = []

  constructor(readonly key: number,
              private readonly val: string,
              private state: boolean = false) {
  }



  async register() {
    return await Register<Node>(this, Node.Pool);
  }


  async unregister() {
    Node.Pool = Node.Pool.filter(e => e.key !== this.key);
  }


  async registerTo(pool: Node[]) {
    await Register<Node>(this, pool);
  }

  zip(): Zip_N {
    return {k: this.key, val: this.val, state: this.state};
  }

  tryActivate(): void {
    this.state = true;
  }
  setState(state:boolean){
    this.state=state
  }

  executable(): boolean {
    return this.state;
  }


  async execute(parallels: Container[] = [], strict: Sign | Sign[] | undefined = undefined) {
    let {sign, NVP} = SignAndVal(this.val);
    const speakInfo=SignAndVal(this.val.split(payloadArrow).slice(-1)[0].trim())

    if(sign!=='[P]' && speakInfo.sign==='[say]' && speakInfo.NVP[0]==='[GG]') {
      sign='[say]'
      let valStartPos=speakInfo.NVP.indexOf(":")
      NVP=speakInfo.NVP.slice(valStartPos+1)
    }
    const nv = NVP.join(" ")
    if (strict !== undefined) {
      sign =sign as Sign
      if(Array.isArray(strict)){
        if( strict.indexOf(sign as Sign)===-1) return
      }else{
        if (sign !== strict) return
      }
    }
    switch (sign) {
      case '[P]': {
        if (!this.state) return
        const F = applyBatch(1)(guessDataV2)
        let res = RPM(nv, parallels)
        if (typeof (res) !== 'boolean') {
          log.success("\t\t[Node->P]:", ...res)
          await F(undefined, res);
          return
        }
        log.gray("\t\t[Node->P]:",nv)
        return
      }
      case '[check]': {
        let m = RPM(nv, parallels)
        if (typeof (m) !== 'boolean') {
          const res = await handleCheck(m[0])
          if (res) {
            this.setState(true)
            log.success("\t\t[Node->Check]:", this.key+'-'+this.val)
          }else{
            this.setState(false)
            log.gray("\t\t[Node->Check]:", this.key+'-'+this.val)
          }
        }
        return;
      }
      case '[Q]': {
        return
      }
      case '[say]':{
        if(speakInfo.NVP[0]!=='[GG]') return
        let m=RPM(nv,parallels);
        if (typeof (m) !== 'boolean') handleSpeak(m[0])
        return
      }
        /**
         * [IS] [ISB] [IN]
         */
      case '[I]':{
        await handleIdentity(nv)
        return
      }
      case '[unknown]': {
        return
      }
      default: {
        if ((await handlerP.findByN(this.key)).length > 0) return;
        let rpm=RPM(this.val,parallels)
        if (typeof (rpm)!=='boolean'){
          if(rpm[0]!==this.val){
            return rpm
          }
        }
        const nvf = await this.read()
        console.log("unknown node:", this.val)
        TokenManager.addTokens(['[unknown]',...nvf.split(" ")])
        return;
      }
    }
  }

  async extractR(prevC: Container[]): Promise<Zip_R[] | undefined> {
    const str = this.val.split(" ");
    const head = str[0];
    if (isParalHead(head) && str[1] === ":") return
    const id_Rs = await handlerP.findByN(this.key)
    //console.log("[Node->extractR:",id_Rs)
    return id_Rs.filter(e => e.nodetype === "trigger").map(e => ({
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
    const isNext = str[2] === "[next]"
    //because the token which triggered the current node has been shifted by the Function: (tryRs),
    //and we have to get it back to change the "[next]" in [0x01] : [next] to the valid value
    const val = isNext ? TokenManager.get() : str.slice(2).join(" ")
    if (isParalHead(head) && str[1] === ":") {
      return {k: head, val: val!};
    }
  }

  read() {
    return nvToStr(this.val);
  }
}