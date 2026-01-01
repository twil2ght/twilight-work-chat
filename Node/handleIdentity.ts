import {handlerI,handlerIN} from "@/src/handleDB";
import {SIGN_CHECK} from "@/src/constants";
import {BELONG_TO, identityToNodeVal, NOT_BELONG_TO, nvpToRegNodes} from "@/src/Chat/module/init";

/**
 * @format : [I] val & key & mode
 */
const demo=[
  //belong
  "[I] [0x01] & [0x02] & S",
  //equal
  "[I] [0x01] & [0x02] & B",
  //unequal (definitely)
  "[I] [0x01] & [0x02] & N",
]
const nvToNvp_Identity = (nv: string): string[] => {
  const r = nv.split(SIGN_CHECK).map(Val => Val.trim());
  console.assert(r.length==3,"[identity] failed: wrong length(!==3)")
  return [r[0], r[1],r[2]];
}
export async function handleIdentity(nv:string):Promise<string>{
  let log:string;
  const [val,key,mode]=nvToNvp_Identity(nv)
  let identityNodeVals:string[]=[]
  switch (mode){
    case 'S':{
      let row=await handlerI.create(key,val)
      identityNodeVals.push(identityToNodeVal(row!,BELONG_TO))
      log=`[Node->I]: ${val} => ${key}`
      break
    }
    case 'B':{
      log=`[Node->I]: ${val} === ${key}`
      let row1=await handlerI.create(key,val)
      let row2=await handlerI.create(val,key)
      identityNodeVals=[...identityNodeVals,identityToNodeVal(row1!,BELONG_TO),identityToNodeVal(row2!,BELONG_TO)]
      break
    }
    case 'N':{
      log=`[Node->I]: ${val} !== ${key}`
      let row=await handlerIN.create(key,val)
      identityNodeVals.push(identityToNodeVal(row!,NOT_BELONG_TO))
      break
    }
    default:{
      log=`[Node->I]: Default: ${val},${key},${mode}`
      break
    }
  }
  console.warn("\t\tℹ️ inserting new Identity:")
  await nvpToRegNodes(identityNodeVals)
  return log
}