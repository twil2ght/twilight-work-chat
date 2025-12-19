import {handleCreate} from "./handleCreate";
import {createGrid} from "./createGrid"
import {nodeDBHandler} from "@/src/handleDB";

/**
 * data with Parallel container is not allowed
 */
const td=`[GG] has to wash the dishes | the dinner is over | the guests have left`
const runTest=async () => {
  await handleCreate(td);
}
const md=`boss to [GG] : | [check] [next] & boss`
const runMeta=async () => {
  await handleCreate(md);
}







runMeta()
    .then(async()=>{
      const td1= "[2] hi | boss to [GG] : | [check] [next] & hi"
      await handleCreate(td1)
  })
    .then(async ()=>{
      let d1=(await nodeDBHandler.findNodeByVal("boss to [GG] :"))?.id!
      const td2={
        triggers:[
          `boss to [GG] :`,
          "[check] [next] & [GG]"
        ],
        results:[
          `[${d1}] [0x01]`,
          "[0x01] : [GG]"
        ]
      }
      await createGrid(td2.results,td2.triggers)
  })
    .then(async()=>{
      let d1=(await nodeDBHandler.findNodeByVal("boss to [GG] :"))?.id!
      const td2={
        triggers:[
          `[${d1}] [0x01]`,
          "[check] [next] & [GG]"
        ],
        results:[
          "[0x01] : [GG]"
        ]
      }
      await createGrid(td2.results,td2.triggers)
    })
