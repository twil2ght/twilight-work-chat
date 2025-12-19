import {Node} from "@/src/Node";
import {Container} from "@/src/container";
export type NodeType = "trigger"|"result"
export type ContainerType = "parallel"
export type Transformer<T = any> = (prev: T, curr: T) => void
export type Converter<T = any> = (item: T) => Promise<void>

export interface NodeConfig {
  key: number
  content: string;
  isActive: boolean;
}

export interface ContainerConfig {
  key: string,
  type: ContainerType,
  content: string,
  name: string
}

export interface RelationConfig {
  key: number
  triggers: Node[],
  results: Node[],
  containers: Container[],
}

export interface ContainerVariant {
  rule: RegExp
  containerType: ContainerType;
}

export interface NextLeap {
  nextNodes: Node[],
  containers: Container[],
}

export interface QueueFlow {
  userStr: string[],
  bingoStuff: NextLeap[],
}


export interface NodeDBConfig {
  id:number;
  content: string;
}
export interface RelationDBConfig{
  id:number;
}
export interface ProjectionDBConfig {
  id:number;
  relation_id:number;
  node_id:number;
  nodetype:NodeType
  created_at:any
}
export interface DBConfig{
  user: string,
  host: string,
  database: string,
  password: string,
  port: number,
}