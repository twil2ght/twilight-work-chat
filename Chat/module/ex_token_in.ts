import {Node} from '../../Node'

/**
 * # 下一个词进来，然后执行所有的check节点
 */
export async function chatExToken_In(){
  await Promise.all(Node.Pool.map(async node=>{
    await node.execute()
  }))
}
