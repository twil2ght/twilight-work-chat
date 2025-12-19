import {Relation} from "../../Relation";

`META_RELATION(id=1):
                trigger:[check] [next] | boss ;
                result:boss to [GG] : `

export async function init(){
  const metaR= new Relation(1,[],[],[])
  await metaR.register()
}



