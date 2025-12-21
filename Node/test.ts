import {Node} from './node'

const testData_check=`[check] [GG] | [GG]`
const testData_P=`[P] [GG] has to wash the dishes | the dinner is over | the guests have left`
const nodeIns1 = new Node(1,testData_check)
const nodeIns2 = new Node(2,testData_P)
async function runtest(){
  /**
   * CASE 1 : [check]
   */
  console.log("is executable:",nodeIns1.executable())
  await nodeIns1.execute().then(()=>{})
  console.log("is executable:",nodeIns1.executable())

  console.log("\n===============================\n")
  /**
   * CASE 2 : [P]
   */
  nodeIns2.tryActivate()
  await nodeIns2.execute().then(()=>{})
}
runtest().catch(()=>{})