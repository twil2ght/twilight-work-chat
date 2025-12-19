import {ContainerConfig, ContainerType} from "../types";
import {Register, Update} from "../utils";
import {SPLIT_END_SIGN_CONTAINER} from "../Node/config";


export class Container{

  key : string=this.id

  constructor(private readonly id:string,
              private readonly name:string,
              private readonly type:ContainerType,
              private  content:string){}

  async registerTo(pool:Container[]){
    const transform=(prev:Container,item:Container)=>{
      prev.content+=" "+item.content;
    }
   if(!await Register<Container>(this,pool)){
     await Update<Container>(this,pool,transform);
   }
  }
  zip():ContainerConfig{
    return {key:this.id,content:this.content,type:this.type,name:this.name};
  }

  /**
   * @example [0x01] : Hello World //
   */
  executable():boolean{
    return this.content.endsWith(SPLIT_END_SIGN_CONTAINER)
  }

}