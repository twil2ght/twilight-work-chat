import {isParallelHead, strToNv} from "@/src/utils";
import {handlerN, handlerR} from "@/src/handleDB";
import {classifyNV, createGrid, handleCreate, NVP_P} from "@/src/Node/handleCreate";
import {Regs, SIGN_C_END} from "@/src/constants";

`     [origin]: if someone [0x01] you have to [0x02]
      R(loop in): [0x01] : [next] | [check] [next] & [any] | if someone
      R(loop in): if someone [0x01] | [check] [next] & [any] | if someone
      R(loop): [0x01] : [next] | [check] [next] & [any] | if someone [0x01]
      R(loop): if someone [0x01] | [check] [next] & [any] | if someone [0x01]
      R(jump out): if someone [0x01] you | [check] [next] & you | if someone [0x01]
      
      R(normal flow): if someone [0x01] you have | [check] [next] & have | if someone [0x01] you
      R(normal flow): if someone [0x01] you have to | [check] [next] & to | if someone [0x01] you have
      R(normal flow): if someone [0x01] you have to [0x02] | [check] [next] & [any] | if someone [0x01] you have to
      
      R(loop): [0x02] : [next] | [check] [next] & [any] | if someone [0x01] you have to [0x02]
      R(loop): if someone [0x01] you have to [0x02] | [check] [next] & [any] | if someone [0x01] you have to [0x02]
      R(jump out): [done]] | [check] [next] & "[end]" | if someone [0x01] you have to [0x02]
      
      R(final): [P] [GG] has to [0x02] | someone [0x01] | [check] [next] & [end]
      ===================================================================================================================
      [origin] if someone [0x01] that means [0x02]
      R(final) [P] [0x02] | someone [0x01]
      `

/**
 * @example:
 * boss to [GG] : if someone [0x01] you have to [0x02]
 * @description the function handlerN.create() is updated to a safer version: exist?return:create
 * @param str
 * @param ids
 */
async function guessData(str: string, ids: { new: string, old: string }[] = []) {
  let nvp: string[]
  nvp = str.split(" ")
  nvp.push("[end]")
  let H;
  let containerID: number = 0
  let relId_forC = await uniParIdGetter()
  let newCId: { new: string, old: string }[] = []
  for (let e of nvp) {
    const tnv = H?.content
    //loop
    let prevE = tnv?.split(" ").slice(-1)[0]
    const prev_isP = prevE !== undefined ? isParallelHead(prevE) : false
    const cur_isP = isParallelHead(e)
    if (cur_isP) {
      //console.log("this a P :",e)
      if (ids.length > 0) {
        e = ids.find(a => a.old === e)!.new
      } else {
        let old = e
        let existed=newCId.find(l=>l.old===e)
        if(existed){
          e=existed.new
        }else{
          e = e.indexOf('*')!==-1?`[0x*${relId_forC}-${containerID++}]`:`[0x${relId_forC}-${containerID++}]`
          newCId.push({new: e, old})
        }
      }
    }

    const isFirst = tnv === undefined

    const rnvAdd_Cur = `${e} : [next]`
    const rnvEnd = `${prevE} : ${SIGN_C_END}`
    const tnvCheck = `[check] [next] & ${isParallelHead(e) ? "[any]" : e}`
    const rnv: string = H !== undefined ? `[${H.id as number}] ${e}` : e
    if (prev_isP) {
      const rnvAdd_Prev = `${prevE} : [next]`
      const tnvAny = `[check] [next] & [any]`
      let res_cg = await createGrid(H !== undefined ? [tnv!, rnvAdd_Prev] : [rnvAdd_Prev], H !== undefined ? [tnv!, tnvAny] : [tnvAny])
      relId_forC=res_cg.rel_id
    }

    //normal flow
    //big trouble : don't [check] [next] & [0x01] (DONE)
    if (e === "[end]") return newCId;
    H = (await handlerN.create(rnv))!
    //console.log("rnv:",rnv)
    let res_cg = await createGrid(prev_isP ? [rnv, rnvEnd] : cur_isP ? [rnv, rnvAdd_Cur] : [rnv], isFirst ? [tnvCheck] : [tnv!, tnvCheck])
    relId_forC=res_cg.rel_id
  }
  return newCId

}



const uniParIdGetter=async():Promise<number>=>{
  return (await handlerR.create())!.id
}

const transform = async(p: string, ids: any[],useGenerator=false) => {
  if(useGenerator) await uniqueIdGenerator(p,ids)
  return p.split(" ").map(e => {
    for (const m of ids) {
      if (m.old === e) {
        return m.new
      }
    }
    return e
  }).join(" ")
}
const transformBatch=async(nv_batch:string[],ids:{ new: string, old: string }[])=>{
  let load=[]
  for(const nv of nv_batch){
    load.push(await transform(nv,ids,true))
  }
  return load
}
const handleIteration = async (np: string[], ids: { new: string, old: string }[]) => {
  let subIDs:typeof ids=[];
  await Promise.all(np.map(async e => {
    const head=e.split(" ")[0]
    if(head==='[say]' || head==='[unknown]') {
      let newIDs = await guessData(e, [...ids, ...subIDs])
      newIDs.forEach(e1 => {
        if (!subIDs.some(ee => ee.old === e1.old)) {
          subIDs.push(e1)
        }
      })
      let T = await strToNv(await transform(e, [...ids, ...subIDs]))
      await createGrid([await transform(e, [...ids, ...subIDs])], [T!.content])
      return e
    }
  }))
  return subIDs
}

const uniqueIdGenerator = async (nv:string,newCId: { new: string, old: string }[] = [])=>{
  let id=0
  let relId_forC = await uniParIdGetter()
  let nvp=nv.split(" ")
  for (let e of nvp){
    if(isParallelHead(e)){
      let old = e
      let existed=newCId.find(l=>l.old===e)
      if(existed){
      }else{
        e = e.indexOf('*')!==-1?`[0x*${relId_forC}-${id++}]`:`[0x${relId_forC}-${id++}]`
        newCId.push({new: e, old})
      }
    }
  }
}

/**
 *
 * @param triN
 * @param resN
 * @param allowHandleSay meta Relation is not allowed
 */
export async function guessDataV2(triN: string | undefined, resN: string[], allowHandleSay: boolean = true) {
  let ids: { new: string, old: string }[] = [];


  if (triN !== undefined) {
    ids = await guessData(triN);
    triN = await transform(triN, ids);
    resN = await transformBatch(resN,ids)
  }


  if (allowHandleSay) {
    for(const i of resN){
      const np: [string, string[]] = classifyNV(NVP_P(i));
      await handleIteration(np[1], ids);
    }
  }


  if (triN !== undefined) {
    const T = await strToNv(triN);
    return await createGrid(resN, [T!.content]);
  } else {
    return await handleCreate(resN[0]);
  }
}

/**
 *
 * @param nv : E.g:`[P] [say] [GG] to boss : yes it is | [say] boss to [GG] : is [0x01] a kind of [0x02] | [0x01] => [0x02]`
 */
export async function handleCreate_metaOnly(nv:string){
  const np: [string, string[]] = classifyNV(NVP_P(nv));
  const ids=await handleIteration(np[1], []);
  if(ids.length===0){
    for(let e of np[1]){
      await uniqueIdGenerator(e,ids)
    }
  }
  np[1]=await Promise.all(np[1].map(e=>transform(e,ids)))
  np[0]=await transform(np[0],ids)
 // console.log(np)
  await createGrid([np[0]],np[1])
}

