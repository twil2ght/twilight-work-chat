import {Zip_C} from "../types";
import {Register, Update} from "../utils";
import {SIGN_C, SIGN_C_END} from "@/src/constants"
import {Node} from "@/src/Node";


export class Container{

  key : string=this.id
  hasExtended:boolean=false
  constructor(private readonly id:string,
              private  content:string=""){}

  async registerTo(pool:Container[]){
    const transform=(prev:Container,item:Container)=>{
      prev.content+=" "+item.content;
    }
   if(await Register<Container>(this,pool)){
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

  setVal(str:string){
    this.content=str
  }
  getVal(){
    return this.content
  }

  /**
   * @example [0x*01] : Hello / World //
   */
  isExtendable(){
    return (this.id.indexOf("*")!==-1) && (!this.hasExtended)
  }

  setExtend(){
    this.hasExtended=true
  }

}