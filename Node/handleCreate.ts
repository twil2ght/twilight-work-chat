import {SIGN_P} from "@/src/constants";
import {handlerN, handlerP, handlerR} from "../handleDB";
import {NodeType, Row_N} from "../types";
import {applyBatch} from "../decorator/applyBatch";
import {parseParallel} from "@/src/Chat/module/register_legacy";

interface RES_CG{
  rel_id:number
  failed:boolean
}

const deduplicateByKey=async(t:Row_N[],r:Row_N[])=>{
  const tIDs = t.map(e => e.id).filter(id => !!id); // 过滤空id，去重
  const rIDs = r.map(e => e.id).filter(id => !!id);
  const relArray_t:number[][]=await Promise.all(tIDs.map(async e=>{
    return (await handlerP.findByN(e)).filter(a=>a.nodetype==='trigger').map(s=>s.relation_id as number)
  }))
  const relArray_r:number[][] = await Promise.all(rIDs.map(async e=>{
    return (await handlerP.findByN(e)).filter(a=>a.nodetype==='result').map(s=>s.relation_id as number)
  }))

  let candidate=[...relArray_r[0]]

  for(const e of relArray_r){
    candidate=candidate.filter(l=>e.indexOf(l)!==-1)
  }
  for(const e of relArray_t){
    candidate=candidate.filter(l=>e.indexOf(l)!==-1)
  }
  return candidate
}
function findCommonElements<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0 || arrays[0].length === 0) return [];

  let commonSet = new Set(arrays[0]);

  for (let i = 1; i < arrays.length; i++) {
    const currentArr = arrays[i];
    const currentSet = new Set(currentArr);
    commonSet = new Set([...commonSet].filter(item => currentSet.has(item)));
    if (commonSet.size === 0) break;
  }

  return [...commonSet];
}
const getSimNRelIDs=async(n:string,mode:NodeType)=>{
  let rows = await handlerN.findAll()
  let nodeVals = rows.filter(e =>{
    return (parseParallel(e.content) === parseParallel(n))
  })
  let rel_ids:number[]=[]
  await Promise.all(nodeVals.map(async m=>{
    let projections = await handlerP.findByN(m.id)
    projections=projections.filter(p=>p.nodetype===mode)
    rel_ids=[...rel_ids,...projections.map(p=>p.relation_id)]
  }))
  return rel_ids
}

const deduplicateByVal=async(t:string[],r:string[])=>{
  const relBatch=[
      ...await Promise.all(t.map(n=>getSimNRelIDs(n,'trigger'))),
      ...await Promise.all(r.map(n=>getSimNRelIDs(n,'result')))
  ]
  return findCommonElements(...relBatch)
}

/**
 *
 * @param rv
 * @param tv
 * @param rel_Id 用于增量添加
 */
export async function createGrid(rv: string[], tv: string[] ,rel_Id:number | undefined=undefined): Promise<RES_CG> {
/*  console.log("tv:",tv)
  console.log("rv:",rv)*/
  const c_val=await deduplicateByVal(tv, rv)
  if(c_val.length>0) return {rel_id:c_val[0],failed:true}
  const F = applyBatch()(handlerN.create.bind(handlerN));
  const t = (await F(tv))!; // 先获取 t
  const r = (await F(rv))!; // 再获取 r
  const candidate=await deduplicateByKey(t, r)
  if(candidate.length>0) return {rel_id:candidate[0],failed:true}
  const RID=rel_Id!==undefined?rel_Id:(await handlerR.create())!.id

  await Promise.all([...t.map(e => handlerP.create(RID, e.id, "trigger")), ...r.map(e => handlerP.create(RID, e.id, "result"))])

  return {rel_id: RID,failed:false}
}

async function clearGrid(id: number) {
  const P = await handlerP.findByR(id);
  await Promise.all(
      P.map(async (p) => {
        await handlerP.delete(p.id);
      })
  )
}

export const NVP_P = (nv: string): string[] => {
  return nv.split(SIGN_P).map(Val => Val.trim());
}

export const classifyNV = (patches: string[]): [string, string[]] => {
  return [patches[0], patches.slice(1)];
}


export async function handleCreate(nv: string): Promise<RES_CG> {
  const [r, t] = classifyNV(NVP_P(nv));
  return await createGrid([r], t,undefined)
}

`==============================================================`
/**
 * data with Parallel container is not allowed
 */
const td = `[GG] has to wash the dishes | the dinner is over | the guests have left`


/*handleCreate(md)
    .then(async () => {
      const td1 = "[2] hi | boss to [GG] : | [check] [next] & hi"
      await handleCreate(td1)
    })
    .then(async () => {
      let d1 = (await handlerN.findByVal("boss to [GG] :"))?.id!
      const td2 = {
        triggers: [
          `boss to [GG] :`,
          "[check] [next] & [GG]"
        ],
        results: [
          `[${d1}] [0x01]`,
          "[0x01] : [GG]"
        ]
      }
      await createGrid(td2.results, td2.triggers)
    })
    .then(async () => {
      let d1 = (await handlerN.findByVal("boss to [GG] :"))?.id!
      const td2 = {
        triggers: [
          `[${d1}] [0x01]`,
          "[check] [next] & [GG]"
        ],
        results: [
          "[0x01] : [GG]"
        ]
      }
      await createGrid(td2.results, td2.triggers)
    })
    .then(async () => {

    })*/
