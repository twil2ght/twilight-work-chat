import {Relation} from "../../Relation";
import {handleCreate} from "@/src/Node/handleCreate";
import {handlerI, handlerIN} from "@/src/handleDB";
import {createObjNodesByVal} from "@/src/Node";
import {Row_I} from "@/src/types";


`META_RELATION(id=1):
                trigger:[check] [next] | boss ;
                result:boss to [GG] : `


const F=async(str:string)=>{
  const metaR= new Relation(  (await handleCreate(str)).rel_id,[],[],[])
  await metaR.register()
}
export async function init(){
  const zero:string[]=[`[say] | [check] [next] & [say]`,`[unknown] | [check] [next] & [unknown]`]
  await Promise.all(zero.map(async str=>await F(str)))
}
export const BELONG_TO="=>"
export const NOT_BELONG_TO="!=>"
export const I_FLOW='[IFlow]'
export const identityToNodeVal=(row:Row_I, sign: '=>'|'!=>')=>{
  return I_FLOW+' '+row.v+' '+sign+' '+row.k
}
export const nvpToRegNodes=async (identityNodeVals:string[])=>{
  const identityNodes=await createObjNodesByVal(identityNodeVals)
  identityNodes.forEach(e=>{
    e.register()
    e.setState(true)
  })
}
/**
 * @example :
 *  '[IFlow]' is used for separation from the normal flow
 *  '=>' refers to "belong to ..."
 *  '!=>' refers to "not belong to ... definitely"
 */
export async function initIdentity(){
  const pairsI = await handlerI.findAll()
  const pairsIN = await handlerIN.findAll()
  const identityNodeVals:string[]=[...pairsI.map(e=>identityToNodeVal(e,BELONG_TO)),...pairsIN.map(e=>identityToNodeVal(e,NOT_BELONG_TO))]
  await nvpToRegNodes(identityNodeVals)
}
`
  ❌️DANGER：该改进是专门处理:由identity注册的Relation无法被注册的问题，然而实际应该不会出现由identity注册的relation，因此这个改进暂时不用实现
[IFlow] [0x01] => [0x02]
[IFlow] [0x01] => [val]
[IFlow] [val] => [0x02]

 ⚠️WARNING: [IFlow] should be put in the handleSay Function
`


