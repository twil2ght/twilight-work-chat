export {handleCreate} from './handleCreate'

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

const md=`if someone says: “Excuse me, where is the bathroom?”,
 then you have to smile and say: “It’s at the end of the hallway on the left”, and lead them there if they look confused`

const correspondent_mt=`boss to [GG] : if someone says [0x01] , then you have to say [0x02]`;
`DESIGN:
      [GG] has to say [0x02] | someone has said [0x01]
`


















const md2=`if our cat is hungry , you have to feed him
            our cat 's name is glow , and it means glow is our cat
            [GG] has to feed our cat | our cat is hungry
            who is our cat
            how does [GG] feed`
const mw=`if glow is hungry , you have to feed him | glow is our cat`
const td2=`glow is hungry
->[check] glow & [GG] 's  cat`
