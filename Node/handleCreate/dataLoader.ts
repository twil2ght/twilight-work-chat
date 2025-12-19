export {handleCreate} from './handleCreate'

const testData= {
  triggers: [
    `boss say to [GG] : when taking out the trash , [0x01](
    tie the trash bag tightly first / 
    then put it in the big trash bin outside the front gate / 
    take out the trash every evening after dinner /)`
  ],
  result: [
    "[P][GG] has to take out the trash | today 's dinner is done"
  ]
}

const testData2 = `
boss: when I call your name, you have to make a response to me
*: [P] [GG] has to make response to boss | boss has called [GG] 's name
==================================================================================
feedback : 
          [unknown] [GG] has to make response to boss
          [unknown] boss has called [GG] 's name
*: [P] how does [GG] know whether boss has called [GG] 's name ? | [unknown] [GG] has to make response to boss
*: [P] how does [GG] make a response to boss ? | [unknown] boss has called [GG] 's name
==================================================================================
GG: how does [GG] know whether boss has called [GG] 's name ?
boss : if I speak out your name , it means I have called your name . 
GG : how do i know whether you have spoken out my name .
boss : if I say : [GG] , it means I have spoken out your name .
GG: how do I make a response to you ?
boss: you can say : I am here , sir . to make a response to me
`
