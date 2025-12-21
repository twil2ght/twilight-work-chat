import {Relation} from '../../Relation'
import {Legacy} from "../chat";
import {Node, SignAndVal} from "@/src/Node";

const dropIsolatedCheckNodes=()=>{
  Node.Pool=Node.Pool.filter(e=>{
    if(SignAndVal(e.zip().val).sign!=='[check]'){
      return true
    }
    return Relation.pool.some(r=>r.zip().t.some(t=>t.key===e.key))
  })
}

export async function tryRs():Promise<Legacy[]>{
  const rs = await Promise.all(Relation.pool.map(r=>{
    return r.unregister()
  }))
  dropIsolatedCheckNodes()
  return rs.filter(e=>e!==undefined)
}

