import {TokenApi} from "./TokenManager";
import {guessDataV2, handleCreate_metaOnly} from "@/src/data/metaLoader";
import {init} from "@/src/Chat/module/init";

export * from './chat'
export * from './TokenManager'
const test = [
    '// [say] boss to [GG] : if I say hello you have to say hello',
    '// [say] boss to [GG] : if i say how are you you have to say I am fine',
    '// [say] boss to [GG] : if i say good bye you have to say good bye',
    '// [say] boss to [GG] : if i say nice to meet you you have to say nice to meet you',
    '// [say] boss to [GG] : if i say what is your name you have to say my name is GoldenGlow',
    '// [say] boss to [GG] : if i say can you speak english you have to say yes i can',
    '// [say] boss to [GG] : if i say thank you you have to say you are welcome',
    '// [say] boss to [GG] : if i say sorry you have to say it does not matter',
    '// [say] boss to [GG] : how are you',
    '// [say] boss to [GG] : hello',
    '// [say] boss to [GG] : good bye',
    '// [say] boss to [GG] : can you speak english',
    '// [say] boss to [GG] : thank you',
    '// [say] boss to [GG] : sorry',
    '// [say] boss to [GG] : apple is a kind of fruit',
    '// [say] boss to [GG] : is apple a kind of fruit',
    '// [say] boss to [GG] : is pear a kind of fruit',
    '// [say] boss to [GG] : if a kind of fruit is mentioned in our talk you can say more about the fruit to me',
    '// [say] boss to [GG] : your name is GoldenGlow',
    '// [say] boss to [GG] : what is your name',
    '//',
]

interface Meta {
    trigger: string;
    result: string | string[];
    allowSay?:boolean
}

const data: Meta[] = [
    {
        trigger: '[say] boss to [GG] : if I say [0xWords01] you have to say [0xWords02]',
        result: [
            '[P] [0x01] -> [say] [GG] to boss : [0xWords02] | [say] boss to [GG] : [0xWords01]',
            '[P] [0x01] : [say] boss to [GG] : [0xWords01] / [GG] is told by boss to do so //'
        ]
    },
    //
    {
        trigger: '',
        result: '[say] boss to [GG] : your [0x02] is [0x01] -> [I] [0x01] & [GG] \'s [0x02] & S | [say] boss to [GG] : your [0x02] is [0x01]',
    },
    {
        trigger: '[say] boss to [GG] : what is your [0x02]',
        result: [
            '[0x03] -> [say] [GG] to boss : my [0x02] is [0x01]',
            '[0x03] : [say] boss to [GG] : what is your [0x02] / [IFlow] [0x01] => [GG] \'s [0x02] //',
            '[0x01] : {[GG] \'s [0x02] AsKey} //'
        ],
    },
    //
    {
        trigger: '',
        result: '[say] boss to [GG] : [0x01] is a kind of [0x02] -> [I] [0x01] & [0x02] & S | [say] boss to [GG] : [0x01] is a kind of [0x02]',
    },
    {
        trigger: '',
        result: '[say] [GG] to boss : yes it is | [say] boss to [GG] : is [0x01] a kind of [0x02] | [IFlow] [0x01] => [0x02]',
    },
    {
        trigger: '',
        result: '[0x01] is a kind of [0x02] | [IFlow] [0x01] => [0x02]',
    },
    {
        trigger: '',
        result: '[say] [GG] to boss : yes it is | [say] boss to [GG] : is [0x01] a kind of [0x02] | [check] [0x01] & [0x02] & [I]',
    },
    {
        trigger: '',
        result: '[say] [GG] to boss : i don\'t know | [say] boss to [GG] : is [0x01] a kind of [0x02] | [check] [0x01] & [0x02] & [UNK]',
    },
    {
        trigger: '[say] boss to [GG] : if I say is [0x01] a kind of [0x02] that means [0x01] and [0x02] is mentioned in our talk',
        result: [
            '[P] [0x01] is mentioned in boss \'s and [GG] \'s talk | [say] boss to [GG] : is [0x01] a kind of [0x02]',
            '[P] [0x02] is mentioned in boss \'s and [GG] \'s talk | [say] boss to [GG] : is [0x01] a kind of [0x02]'
        ],
    },
    {
        trigger: '[say] boss to [GG] : is [0x01] a kind of [0x02]',
        result: [
            '[0x*03] is mentioned in boss \'s and [GG] \'s talk',
            '[0x*03] : [0x01] / [0x02] //'
        ],
    },
    {
        trigger: '[say] boss to [GG] : if a kind of [0x02] is mentioned in our talk you can say more about the [0x02] to me',
        result: '[P] [GG] has to say more about [0x01] to boss | [0x01] is mentioned in boss \'s and [GG] \'s talk | [IFlow] [0x01] => [0x02]',
    },
    {
        trigger: '',
        result: '[say] [GG] to boss : how do I [0x01] | [unknown] [GG] has to [0x01] to boss',
    },

]

const registerMeta = async () => {
    for (const e of data) {
        e.trigger !== '' ? await guessDataV2(e.trigger, Array.isArray(e.result)?e.result:[e.result], e.allowSay!==undefined?e.allowSay:false) : await handleCreate_metaOnly(Array.isArray(e.result)?e.result[0]:e.result)
    }
}

init().then(async () => {
    await registerMeta().then(() => {
        for (const e of test) {
            for (const ee of e.split(" ")) {
                TokenApi.addToken(ee)
            }
        }
    })
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

;`✅️[DONE]
  "[P] [say] [GG] to boss : yes | boss to [GG] : is [0x01] a kind of [0x02] | [0x01] => [0x02]",
  (unpack all containers->)
  "[P] [say] [GG] to boss : yes | boss to [GG] : is apple a kind of fruit | apple => fruit",
  Node:(apple => fruit)  <-- registerAllIdentity()
  
  
  STEP 1 : write code:  registerAllIdentity()
  STEP 2 : unpack containers in Relation.register()
  STEP 3 : deploy Function : registerAllIdentity() 
            if another identity is learned during running you have to run registerAllIdentity again
  DONE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  (OUT!!!)⚠️WARNING: this change may lead to the depreciation of [check] (it can only handle the [EQUAL] case now)
`;
// ⚠️如果这个identity是不存在的那么他会创建，不过state为false
` ✅️✅️✅️✅️✅️✅️✅️✅️✅️✅️[check] : I AM BACK!!!`;
`you can date back the whole chain of a result node simply by recording which relation it is in`