import {Relation} from "../../Relation";
import {handleCreate} from "@/src/Node/handleCreate";

`META_RELATION(id=1):
                trigger:[check] [next] | boss ;
                result:boss to [GG] : `

export async function init(){
  const md = `boss | [check] [next] & boss`
  await handleCreate(md)
  const metaR= new Relation(1,[],[],[])
  await metaR.register()
}



