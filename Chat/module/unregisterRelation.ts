import {Relation} from '../../Relation'
import {Legacy} from "../chat";
export function unregisterRelation():Legacy[]{
  const res = Relation.pool.map(r=>{
    return r.isAllTriggersReady()?r.unregister():undefined
  })
  return res.filter(e=>e!==undefined)
}

