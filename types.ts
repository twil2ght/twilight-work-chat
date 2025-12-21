import {Node} from "@/src/Node";
import {Container} from "@/src/Container";

export type NodeType = "trigger"|"result"
`============================================`
export interface Zip_N {
  k: number
  val: string;
  state: boolean;
}
export interface Zip_C {
  k: string,
  val: string,
}
export interface Zip_R {
  k: number
  t: Node[],
  r: Node[],
  c: Container[],
}

`===============================================`
export interface Row_N {
  id:number;
  content: string;
}
export interface Row_R {
  id:number;
}
export interface Row_P {
  id:number;
  relation_id:number;
  node_id:number;
  nodetype:NodeType
  created_at:any
}
export interface Row_I {
  id:number,
  k:string,
  v:string,
  created_at:any
}
export interface Row_IN {
  id:number,
  k:string,
  v:string,
  created_at:any
}
