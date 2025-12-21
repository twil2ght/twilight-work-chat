import {TokenApi} from "./TokenManager";
import {guessDataV2} from "@/src/data/metaLoader";
import {init} from "@/src/Chat/module/init";

export * from './chat'
export * from './TokenManager'
const test = [
  '// boss to [GG] : if I say hello you have to say hello',
  '// boss to [GG] : if i say how are you you have to say I am fine',
  '// boss to [GG] : if i say good bye you have to say good bye',
  '// boss to [GG] : if i say nice to meet you you have to say nice to meet you',
  '// boss to [GG] : if i say what is your name you have to say my name is GoldenGlow',
  '// boss to [GG] : if i say can you speak english you have to say yes i can',
  '// boss to [GG] : how are you',
  '// boss to [GG] : hello',
  '// boss to [GG] : good bye',
  '// boss to [GG] : what is your name',
  '// boss to [GG] : can you speak english',
  '//'
]

const meta = [
  'boss to [GG] : if I say [0xWords01] you have to say [0xWords02]',
  '[P] [say] boss to [GG] : [0xWords01] -> [say] [GG] to boss : [0xWords02] | [say] boss to [GG] : [0xWords01]',
]

init().then(()=>{
  guessDataV2(meta[0], meta[1],false).then(() => {
    for (const e of test) {
      for (const ee of e.split(" ")) {
        TokenApi.addToken(ee)
      }
    }
  });
})


//(DONE) your logPrinter is totally awful
//(DONE)all the [check] nodes should be killed after being activated
//(DONE)deduplicate the relation is vital
//(DONE)the loop doesn't work and that is the worst
//(DONE)[P] doesn't catch the value of [0x01] and [0x02]
//(DONE)deduplicate containers: when doing extractP,
//(depreciated)1.if the new container has the same name as a previous container ,rename the new container
//(DONE)2.name the container after the relation where it is in order to let all the containers get unique ids
//(DONE)but keep those [0x01] and [0x02] as some sign which can be used to distinguish which group containers are totally identical
//(DONE)[P] boss to [GG] : [0x01] -> [GG] to boss : [0x02] | boss to [GG] : [0x01]
//(DONE)as these nodes are all about speaking words,you have to use Function:guessDataV2 on them before writing them into database
//(DONE)meta relation is not allowed to handleSay
//apply more meta Relation from resource