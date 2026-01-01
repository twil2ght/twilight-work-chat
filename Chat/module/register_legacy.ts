import {Legacy} from "../chat";
import {Container} from "../../Container"
import {Relation} from "../../Relation"
import {createObjNodesByVal, Node} from "@/src/Node";
import {isParallelHead} from "@/src/utils";
import {TokenManager} from "@/src/Chat";
import {handlerN, handlerP} from "@/src/handleDB";
import {Regs, SIGN_C, SIGN_C_END} from "@/src/constants";

interface RootAndSim {
    root: Node,
    sim: Node[]
}

const isEnd = () => {
    return TokenManager.getHistory().slice(-1)[0] === '//'
}

const activateNodes = (results: Node[]) => {
    results.forEach(e => e.tryActivate())
}
export const parseParallel = (nv: string, mapper: Record<string, string> = {}): string => {
    const nvp = nv.split(" ");
    let id = 0;
    const res: string[] = [];

    for (const e of nvp) {
        if (Regs.parallel.test(e)) {
            if (!mapper[e]) {
                mapper[e] = `[SIGN${id++}]`;
            }
            res.push(mapper[e]);
        } else {
            res.push(e);
        }
    }

    return res.join(" ");
};
const findIsolatedNodes = async () => {
    let rows = await handlerN.findAll()
    let load = await Promise.all(rows.map(async e => {
        let projections = await handlerP.findByN(e.id)
        if (!projections.some(p => p.nodetype === 'result')) return e
    }))
    return load.filter(e => e !== undefined)
}
/**
 * @example:
 * Root: [GG] likes [0x01]
 * SimNode1: [GG] likes [0x0555]
 * SimNode2: [GG] likes [0x44-1]
 * @param nv
 */
export const findSimNodes = async (nv: string) => {
    let rows = await findIsolatedNodes()
    const nodeVals = rows.filter(e => parseParallel(e.content) === parseParallel(nv) && e.content !== nv).map(e => e.content)
    return createObjNodesByVal(nodeVals)
}
const parseLegacyForSimNodes = (root: Node, sim: Node, legacy_C: Container[], simC: Container[]) => {
    const nvp_root = root.zip().val.split(" ")
    const nvp_sim = sim.zip().val.split(" ")
    let load = [...legacy_C]
    nvp_root.forEach((e, index) => {
        if (isParallelHead(e)) {
            const cName_sim = nvp_sim[index]
            const c_sim = simC.find(c => c.key === cName_sim)
            const c_root = legacy_C.find(c => c.key === e)
            c_sim!.setVal(c_root!.getVal())
            load = load.filter(c => {
                return c.key !== e
            })
        }
    })
    simC.push(...load)
}
const parseContainersForSimNodes = (sim: Node): Container[] => {
    let simC: Container[] = []
    const nvp = sim.zip().val.split(" ")
    nvp.forEach(e => {
        if (isParallelHead(e)) {
            const c = new Container(e)
            if (!simC.some(c => c.key === e)) simC.push(c)
        }
    })
    return simC
}
const legacy_extractP = async (results: Node[], containers: Container[]) => {
    await Promise.all(results.map(async e => {
        const zip_c = await e.extractP(containers)
        if (zip_c) {
            const c = new Container(zip_c.k, zip_c.val)
            await c.registerTo(containers)
        }
    }))
}
const executeAllNodes = async (results: Node[], containers: Container[]) => {
    let pureNodeVals: string[] = [] //no containers
    await Promise.all(results.map(async e => {
        const pureNV = await e.execute(containers, ['[P]', '[say]', '[unknown]', '[Q]', '[I]','[default]'])
        if (pureNV) {
            pureNodeVals = [...pureNodeVals, ...pureNV]
        }
    }))
    return pureNodeVals
}
const legacy_extractR = async (results: Node[], containers: Container[]): Promise<RootAndSim[]> => {
    let rootAndSim: RootAndSim[] = []
    await Promise.all(results.map(async e => {

        const zip_R = await e.extractR(containers)
        //if(e.key===555555) console.log(zip_R)
        if (zip_R == undefined) return
        //find simNodes
        const sims = await findSimNodes(e.zip().val)

        rootAndSim.push({root: e, sim: sims})


        for (const e1 of zip_R) {
            const r = new Relation(e1.k, e1.t, e1.r, e1.c)
            await r.register(e)

        }
    }))
    return rootAndSim
}
const extendParallel = (cs: Container[]) => {
    if (!cs.every(c => c.executable())) return [cs]
    let newCs: Container[][] = []
    cs.forEach(c => {
        if (c.executable() && c.isExtendable()) {
            // console.log("test new feature")
            const newVals = c.zip().val.split(SIGN_C).map(e => e.trim()).filter(s => s !== SIGN_C_END && s !== '')
            // console.log("newVAls",newVals)
            newVals.forEach(val => {
                newCs.push(cs.map(cc => {
                    if (cc.key === c.key) {
                        const newC = c.clone()
                        newC.setVal(val + " " + SIGN_C_END)
                        newC.setExtend()
                        // console.log(newC)
                        return newC
                    }
                    return cc.clone()
                }))
            })
        }
    })
    // if(newCs.length>0)console.log("newCs",newCs)
    return newCs.length > 0 ? newCs : [cs]
}

async function handlePure(pureNodeVals: string[]) {
    const pureNodes = await createObjNodesByVal(pureNodeVals)
    activateNodes(pureNodes)
    await executeAllNodes(pureNodes,[])
    await legacy_extractR(pureNodes, []) //pureNodes doesn't have any containers so [] is here

}

async function handleExtractR_extended(legacy: Legacy) {
    const rootAndSims = await legacy_extractR(legacy.rs, legacy.cs)


    //do the pagination step
    if (legacy.cs.every(c => c.executable())) {
        await Promise.all(rootAndSims.map(pair => {

            activateNodes(pair.sim)

            pair.sim.forEach(async sim => {

                const simC = parseContainersForSimNodes(sim)
                //transfer the legacy to simC
                parseLegacyForSimNodes(pair.root, sim, legacy.cs, simC)
                // if(pair.root.key===392) console.log("simC:",simC)
                await legacy_extractR([sim], simC)
            })


        }))
    }
}

async function F(legacy: Legacy) {

    //normal flow
    activateNodes(legacy.rs)
    await legacy_extractP(legacy.rs, legacy.cs)
    const pureNodeVals = await executeAllNodes(legacy.rs, legacy.cs)
    await handlePure(pureNodeVals)
    const newCs = extendParallel(legacy.cs)
    for (let cs of newCs) {
        await handleExtractR_extended({...legacy, cs: cs})
    }
}

/**
 * 上一个relation死了，遗产(result和container)传下来，激活result，给parallel加料的节点执行一下，抽取个新parallel和relation并把遗产传给抽取的relation,新relation再注册
 * @param legacy
 */
export async function registerLegacy(legacy: Legacy[]) {
    for (const e of legacy) {
        if (e.isLoop && isEnd()) continue
        e.cs = e.cs.map(container => container.clone());
        await F(e)
    }
}
