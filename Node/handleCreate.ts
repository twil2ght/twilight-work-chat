import {SIGN_P} from "@/src/constants";
import {handlerN, handlerP, handlerR} from "../handleDB";
import {Row_N} from "../types";
import {applyBatch} from "../decorator/applyBatch";

/**
 *
 * @param rv
 * @param tv
 * @param rel_Id 用于增量添加
 * @param print
 */
export async function createGrid(rv: string[], tv: string[] ,rel_Id:number | undefined=undefined,print:boolean=false): Promise<number> {

  let [t, r]: [Row_N[], Row_N[]] = [[], []]
  const F = applyBatch()(handlerN.create.bind(handlerN));
  t = (await F(tv))!; // 先获取 t
  r = (await F(rv))!; // 再获取 r
  const tIDs = t.map(e => e.id).filter(id => !!id); // 过滤空id，去重
  const rIDs = r.map(e => e.id).filter(id => !!id);
  const relArray_t:number[][]=await Promise.all(tIDs.map(async e=>{
    return (await handlerP.findByN(e)).filter(a=>a.nodetype==='trigger').map(s=>s.relation_id as number)
  }))
  const relArray_r:number[][] = await Promise.all(rIDs.map(async e=>{
    return (await handlerP.findByN(e)).filter(a=>a.nodetype==='result').map(s=>s.relation_id as number)
  }))
  //console.log(`=================================================`)
  //console.log("relArray_t:",relArray_t)
  //console.log("relArray_r:",relArray_r)
  let candidate=[...relArray_r[0]]

  for(const e of relArray_r){
    candidate=candidate.filter(l=>e.indexOf(l)!==-1)
  }
  for(const e of relArray_t){
    candidate=candidate.filter(l=>e.indexOf(l)!==-1)
  }
  if(print){
    console.log("existed relation:",candidate)
    console.log("T:",tv)
    console.log("R:",rv)

  }
  if(candidate.length>0) return candidate[0]
  const RID=rel_Id!==undefined?rel_Id:(await handlerR.create())!.id

  await Promise.all([...t.map(e => handlerP.create(RID, e.id, "trigger")), ...r.map(e => handlerP.create(RID, e.id, "result"))])

  return RID
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


export async function handleCreate(nv: string,print:boolean=false): Promise<number> {
  const [r, t] = classifyNV(NVP_P(nv));
/*  console.log("\t\tr:",r)
  console.log("\t\tt",t)*/
  return await createGrid([r], t,undefined,print)
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
