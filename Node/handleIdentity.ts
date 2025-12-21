import {handlerI,handlerIN} from "@/src/handleDB";
import {SIGN_CHECK} from "@/src/constants";

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
  console.assert(r.length!==3,"[identity] failed: wrong length(!==3)")
  return [r[0], r[1],r[2]];
}
export async function handleIdentity(nv:string):Promise<void>{
  const [val,key,mode]=nvToNvp_Identity(nv)
  switch (mode){
    case 'S':{
      await handlerI.create(key,val)
      return
    }
    case 'B':{
      await handlerI.create(key,val)
      await handlerI.create(val,key)
      return
    }
    case 'N':{
      await handlerIN.create(key,val)
      return
    }
    default:{
      return
    }
  }
}