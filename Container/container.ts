import {CType, Zip_C} from "../types";
import {Register, Update} from "../utils";
import {SIGN_C_END} from "@/src/constants"


export class Container{

  key : string=this.id

  constructor(private readonly id:string,
              private readonly name:string,
              private readonly type:CType,
              private  content:string){}

  async registerTo(pool:Container[]){
    const transform=(prev:Container,item:Container)=>{
      prev.content+=" "+item.content;
    }
   if(!await Register<Container>(this,pool)){
     await Update<Container>(this,pool,transform);
   }
  }
  zip():Zip_C{
    return {k:this.id,val:this.content,type:this.type,name:this.name};
  }

  /**
   * @example [0x01] : Hello World //
   */
  executable():boolean{
    return this.content.endsWith(SIGN_C_END)
  }

}