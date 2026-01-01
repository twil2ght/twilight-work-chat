import {
    getBracketVal,
    isIGetContainer,
    isNodeHead,
    isParallelHead,
    log,
    Register,
    splitIgnoreBraceSpace
} from "../utils";
import {Zip_C, Zip_N, Zip_R} from "../types";
import {Container} from "@/src/Container";
import {RPM} from "./parallelMapper";
import {handleCheck} from "./handleCheck";
import {applyBatch} from "../decorator/applyBatch";
import {handlerI, handlerN, handlerP} from "../handleDB";
import {isDebug, TokenManager} from "@/src/Chat";
import {handleSpeak} from "@/src/Node/handleSpeak";
import {Regs, SIGN_C_END, SIGN_INVERSE_NODE} from "@/src/constants";
import {guessDataV2} from "@/src/data/metaLoader";
import {handleIdentity} from "@/src/Node/handleIdentity";
import {findSimNodes} from "@/src/Chat/module/register_legacy";

type Sign = '[P]' | '[check]' | '[say]' | '[unknown]' | '[Q]' | '[I]' | '[default]'

const SIGNS: Sign[] = ['[P]', '[check]', '[say]', '[unknown]', '[Q]', '[I]', '[default]']
const payloadArrow = '->'

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

const handleIdGet = async (igHead: string, cs: Container[] = []) => {
    const nvp = getBracketVal(igHead).split(' ')
    const [valRaw, sign] = [nvp.slice(0, nvp.length - 1).join(" "), nvp[nvp.length - 1]]
    const val = RPM(valRaw, cs)
    // if(igHead==='{[GG] \'s [0x33-0] AsKey}') console.log("igGEt",val)
    if (!val) return
    if (sign === 'AsKey') return (await handlerI.findByK(val[0])).map(e => e.v)
    if (sign === 'AsVal') return (await handlerI.findByV(val[0])).map(e => e.k)

}

const getOriginalID = async (nv: string) => {
    const nvp = nv.split(" ")
    if (nvp.length !== 2) return
    if (!isNodeHead(nvp[0])) return
    return +getBracketVal(nvp[0])
}

export const SignAndVal = (nodeVal: string) => {
    const str = nodeVal.split(" ");
    return {sign: str[0], NVP: str.slice(1)};
}

export async function createObjNodesByVal(val: string[]) {
    let F = applyBatch()(handlerN.create.bind(handlerN))
    let row = await F(val)
    return row!.map(e => new Node(e.id, e.content))
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


    async drop() {
        Node.Pool = Node.Pool.filter(e => e.key !== this.key);
    }


    async registerTo(pool: Node[]) {
        await Register<Node>(this, pool);
    }

    zip(): Zip_N {
        return {k: this.key, val: this.val, state: this.state};
    }

    tryActivate(): void {
        const test: number[] = [6111,6113]
        if (test.indexOf(this.key) !== -1) log.success("test successful:", this.val)
        this.state = true;
    }

    setState(state: boolean) {
        this.state = state
    }

    getState() {
        return this.state
    }

    read() {
        return nvToStr(this.val);
    }

    async executable(): Promise<boolean> {
        if (this.isInverse()) {
            const id_org = await getOriginalID(this.val)
            if (!id_org) return true
            const nOriginal = Node.Pool.find(n => n.key === id_org)
            if (!nOriginal) return true
            return !nOriginal.getState()
        }
        return this.state;
    }

    async execute(parallels: Container[] = [], strict: Sign | Sign[] | undefined = undefined) {
        if (this.isParallelExtractor()) return
        let {sign, NVP} = SignAndVal(this.val);
        if (SIGNS.indexOf(sign as Sign) === -1) sign = '[default]' as Sign
        const payload = SignAndVal(this.val.split(payloadArrow).slice(-1)[0].trim())
        if (sign !== '[P]' && ((payload.sign === '[say]' && payload.NVP[0] === '[GG]') || payload.sign === '[I]')) {
            sign = payload.sign
            let valStartPos = payload.NVP.indexOf(":")
            NVP = payload.NVP.slice(valStartPos + 1)
        }
        const nv = NVP.join(" ")
        if (strict !== undefined) {
            sign = sign as Sign
            if (Array.isArray(strict)) {
                if (strict.indexOf(sign as Sign) === -1) return
            } else {
                if (sign !== strict) return
            }
        }
        switch (sign) {
            case '[P]': {
                if (!this.state) return
                const F = applyBatch(1)(guessDataV2)
                let res = RPM(nv, parallels)
                if (res) {
                    const callback = await F(undefined, [res]);
                    if (callback && callback[0].failed === false) {
                        log.success("\t\t[Node->P]:", ...res)
                    }
                    return
                }
                if (isDebug) log.gray("\t\t[Node->P]:", nv)
                return
            }
            case '[check]': {
                let m = RPM(nv, parallels, true)
                if (m) {
                    const res = await handleCheck(m[0])
                    if (res) {
                        this.setState(true)
                        if (isDebug) log.success("\t\t[Node->Check]:", this.key + '-' + this.val)
                    } else {
                        this.setState(false)
                        if (isDebug) log.gray("\t\t[Node->Check]:", this.key + '-' + this.val)
                    }
                }
                return;
            }
            case '[Q]': {
                return
            }
            case '[say]': {
                if (payload.NVP[0] !== '[GG]') return
                if(this.key===6113) console.log("cs:",parallels)
                let m = RPM(nv, parallels);
                if (m) handleSpeak(m[0])
                return
            }

            case '[I]': {
                let m = RPM(nv, parallels)
                if (m) {
                    const logText = await handleIdentity(m[0])
                    log.success('\t\t✅ ' + logText)
                }
                return
            }
            case '[unknown]': {
                return
            }
            default: {

                if ((await this.hasLinkedR())) return;
                if((await findSimNodes(this.val)).length>0) return
                const pureNvBatch = RPM(this.val, parallels)
                // if (this.key === 6113) console.log(parallels)
                if (pureNvBatch && pureNvBatch[0] !== this.val) return pureNvBatch

                const str = await this.read()
                console.log("\t\t⚠️ [Unknown]:", this.val)
                //at least put them behind a "//"
                // console.log("before:",TokenManager.getAll())
                TokenManager.addTokens(['[unknown]', ...str.split(" "),'//'])
                // console.log("after:",TokenManager.getAll())
                return;
            }
        }
    }

    async extractR(prevC: Container[]): Promise<Zip_R[] | undefined> {
        if (this.isParallelExtractor()) return
        return (await this.findLinkedR()).map(e => ({
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
    async extractP(cs: Container[] = []): Promise<Zip_C | undefined> {
        if (!this.isParallelExtractor()) return
        const nvp = splitIgnoreBraceSpace(this.val)
        const head = nvp[0];
        const isNext = nvp[2] === "[next]"
        let val = isNext ? TokenManager.get() : nvp.slice(2).join(" ")
        if (isIGetContainer(nvp)) {
            let valueFromKey = await handleIdGet(nvp[2], cs)
            if (valueFromKey) val = valueFromKey[0] + SIGN_C_END
            else val = ""
        }


        return {k: head, val: val!};

    }


    private isInverse(): boolean {
        return this.val.endsWith(SIGN_INVERSE_NODE)
    }

    private isParallelExtractor(): boolean {
        const nvp = splitIgnoreBraceSpace(this.val)
        return isParallelHead(nvp[0]) && nvp[1] === ":"
    }

    private async findLinkedR(){
        const id_Rs = await handlerP.findByN(this.key)
        return id_Rs.filter(e => e.nodetype === "trigger")
    }

    private async hasLinkedR(){
        return (await this.findLinkedR()).length>0
    }
}