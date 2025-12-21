import {Zip_C} from "../types";
import {Register, Update} from "../utils";
import {SIGN_C_END} from "@/src/constants"


export class Container{

  key : string=this.id

  constructor(private readonly id:string,
              private  content:string){}

  async registerTo(pool:Container[]){
    const transform=(prev:Container,item:Container)=>{
      prev.content+=" "+item.content;
    }
   if(typeof(await Register<Container>(this,pool))!=='boolean'){
     await Update<Container>(this,pool,transform);
   }
  }
  zip():Zip_C{
    return {k:this.id,val:this.content};
  }
  clone(): Container {
    return new Container(
        this.id,
        this.content
    );
  }

  /**
   * @example [0x01] : Hello World //
   */
  executable():boolean{
    return this.content.endsWith(SIGN_C_END)
  }

}