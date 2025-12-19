import {Relation} from "../../Relation";

`META_RELATION(id=1):
                trigger:[check] [next] | boss ;
                result:boss to [GG] : `

export async function chatInit(){
  const metaRelation= new Relation(1,[],[],[])
  await metaRelation.register()
}



