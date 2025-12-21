import {strToNv} from "@/src/utils";

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

import {handlerN, handlerR} from "@/src/handleDB";
import {classifyNV, createGrid, handleCreate, NVP_P} from "@/src/Node/handleCreate";
import {Regs, SIGN_C_END} from "@/src/constants";

/**
 * @example:
 * boss to [GG] : if someone [0x01] you have to [0x02]
 * @description the function handlerN.create() is updated to a safer version: exist?return:create
 * @param str
 * @param ids
 */
async function guessData(str:string,ids:{new:string,old:string}[]=[]){
  let nvp:string[]
  nvp=str.split(" ")
  nvp.push("[end]")
  let H;
  let containerID:number=0
  let relId_forC=(await handlerR.create())!.id;
  let newCId:{new:string,old:string}[]=[]
  for(let e of nvp){
    const tnv=H?.content
    //loop
    let prevE=tnv?.split(" ").slice(-1)[0]
    const prev_isP=prevE!==undefined?Regs.parallel.test(prevE):false
    const cur_isP=Regs.parallel.test(e)
    if(cur_isP){
      //console.log("this a P :",e)
      if(ids.length>0){
        e=ids.find(a=>a.old===e)!.new
      }else{
        let old=e
        e=`[0x${relId_forC}-${containerID++}]`
        newCId.push({new:e,old})
      }
    }

    const isFirst=tnv===undefined

    const rnvAdd_Cur=`${e} : [next]`
    const rnvEnd=`${prevE} : ${SIGN_C_END}`
    const tnvCheck=`[check] [next] & ${Regs.parallel.test(e)?"[any]":e}`
    const rnv:string=H!==undefined?`[${H.id as number}] ${e}`:e
    if(prev_isP){
      const rnvAdd_Prev=`${prevE} : [next]`
      const tnvAny=`[check] [next] & [any]`
     relId_forC= await createGrid(H!==undefined?[tnv!,rnvAdd_Prev]:[rnvAdd_Prev],H!==undefined?[tnv!,tnvAny]:[tnvAny])
    }

    //normal flow
    //big trouble : don't [check] [next] & [0x01] (DONE)
    if(e==="[end]") return newCId;
    H=(await handlerN.create(rnv))!
    //console.log("rnv:",rnv)
    relId_forC=await createGrid(prev_isP?[rnv,rnvEnd]:cur_isP?[rnv,rnvAdd_Cur]:[rnv],isFirst?[tnvCheck]:[tnv!,tnvCheck])
    }
  return newCId

}

`
    if someone says [0x01] to you you have to say [0x02] to him
    [P] someone to [GG] : [0x01] -> [GG] to someone : [0x02] | someone to [GG] : [0x01]
`;

const transform=(p:string,ids:any[])=>{
  return p.split(" ").map(e=>{
    for(const m of ids){
      if(m.old===e){
        return m.new
      }
    }
    return e
  }).join(" ")
}
const handleSay=async (np:string[],ids:{new:string,old:string}[])=>{
  return await Promise.all(np.map(async e=>{
    let ep=e.split(" ")
    let [head,val]=[ep[0],ep.slice(1)]
    if(head==='[say]'){
      await guessData(val.join(" "))
      let T=await strToNv(transform(val.join(" "),ids))
      await createGrid([transform(e,ids)],[T!.content])
    }
    return e
  }))
}

/**
 *
 * @param i
 * @param p
 * @param allowHandleSay meta Relation is not allowed
 */
export async function guessDataV2(i: string | undefined, p: string, allowHandleSay: boolean = true) {
  let ids: { new: string, old: string }[] = [];


  if (i !== undefined) {
    ids = await guessData(i);
    i = transform(i, ids);
    p = transform(p, ids);
  }


  const np: [string, string[]] = classifyNV(NVP_P(p));
  if(allowHandleSay){np[1] = await handleSay(np[1], ids);}
  // console.log("i:", i)
  // console.log("p:", p)


  if (i !== undefined) {
    const T = await strToNv(i);
    await createGrid([p], [T!.content]);
  } else {
    await handleCreate(p);
  }
}

