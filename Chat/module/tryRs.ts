import {Relation} from '../../Relation'
import {Legacy} from "../chat";

export function tryRs():Legacy[]{
  const rs = Relation.pool.map(r=>{
    return r.satisfied()?r.unregister():undefined
  })
  return rs.filter(e=>e!==undefined)
}

