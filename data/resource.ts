`    
    "[P] [GG] can say what is [0x01] to boss | [GG] does not what [0x01] is",
    "[P] [GG] does not know what [0x01] is | [unknown] [Q] what is [0x01]",
    "[P] [GG] does not know where [0x01] is | [unknown] where is [0x01]",
    "[P] [GG] does not know who [0x01] is | [unknown] who is [0x01]",
    "[P] [GG] does not know which [0x01] is | [unknown] which is [0x01]",
    "[P] [GG] does not know how to [0x01] | [unknown] [GG] has to [0x01]",
    "[P] [GG] does not know why should [GG] [0x01] | [unknown] why [GG] has to [0x01]",
    "[P] [GG] does not know why should [GG] [0x01] if [0x02] | [unknown] why [GG] has to [0x01] if [0x02]",
`;
`
    "[0x01] is a kind of [0x02]",
    "[0x01] is [0x02]",
    "[0x01] is not a kind of [0x02]",
    "[0x01] is not [0x02]",
     //belong
    "[I] [0x01] & [0x02] & S",
    //equal
    "[I] [0x01] & [0x02] & B",
    //unequal (definitely)
    "[I] [0x01] & [0x02] & N",

`;

/**
 * @example : formats
 * 1.the format of container id : [0x+rel_id+'-'+'number++'] E.g: [0x66-1]
 * @example : Rules
 * 1. whenever you move forward to a more complex situation, you are only allowed to step just a little bit
 * 2.never jump to a complex situation along with a huge gap
 * 3.if you try to make extensions, you can choose to extend in terms of relation-constraints,time-constraints,extent-measurement
 *
 * @example : tricks
 * 1. the value should be passed down as the payload. E.g: [0x01] -> [GG] know why ... (the payload[0x01] is the specific reason for why)
 * 2. words that spoke by a person should be transformed to a descriptive sentence in a gesture to be processed as a legal node. E.g:[P] [0xPerson] asks [GG] what [0x01] is | [0xPerson] to [GG] : what is it
 * 3.
 * @example : specifications
 * 1.will do sth -> [GG] has to do sth; done sth -> [GG] does sth; is doing sth -> [GG] does sth;
 * 2.ABOUT API: [check] can only be used like: [P] [check] [0x01] & [0x02] | [0x01] is a kind of [0x02];[IS] follows above
 */
const new_labels = ["->", "[Q]", "{}","=>","!=>"]
/**
 * @example :
 * use the part which does not contain [LABEL]
 */
const API = [
  //identity
  "[P] [IS] [0x01] & [0x02] | boss to [GG] : [0x01] is a kind of [0x02]", //use trigger
  "[P] [0x01] is a kind of [0x02] | [check]  [0x01] & [0x02]",    //use result
  //unknown
  "[GG] does not what [0x01] is | [unknown] [Q] what is [0x01]" //use result

]
export const resource: string[] = [
  //多巴胺
  "if [0x01] brings you happiness you can say you like it",
  "[P] [GG] likes [0x01] | [0x01] brings [GG] happiness",
  //道德
  "if [0x01] is not a bad thing then you are allowed to [0x01]",
  "[P] [GG] is allowed to [0x01] | [0x01] is not a bad thing",
  //学会提问
  "[GG] does not know what [0x01] is | [check] [Q] what is [0x01] & [null]",
  "if you don't know what [0x01] is you can say what is [0x01] to me",
  "[P] [GG] to boss : what is [0x01] | [GG] does not know what [0x01] is",
  "if you don't know what [0x01] is you can ask me by saying what is [0x01]",
]
const meta = [
  "=====================Meta=======================",
  "if [0xPerson] says [0x01] to you you have to say [0x02] to him",
  "[P] [0xPerson] to [GG] : [0x01] -> [GG] to [0xPerson] : [0x02] | [0xPerson] to [GG] : [0x01]",
  "=====================Meta2.0=======================",
  "if [0xPerson] says [0x01] to you you have to say [0x02] to him because [0x03]",
  "[P] [0xPerson] to [GG] : [0x01] -> [GG] to [0xPerson] : [0x02] | [0xPerson] to [GG] : [0x01] | [0x03]",
  "=====================Meta2.1=======================",
  "if [0xPerson] says [0x01] to you you have to say [0x02] to him if [0x03]",
  "[P] [0xPerson] to [GG] : [0x01] -> [GG] to [0xPerson] : [0x02]| [0xPerson] to [GG] : [0x01] | [0x03]",
  "=====================Meta4.0=======================",
  "if [0xPerson] says what is your [0x01] to you you have to say my [0x01] is [0x02] because your [0x01] is [0x02]",
  "[P] [GG] to [0xPerson] : my [0x01] is {[GG] 's [0x01]} | [0xPerson] to [GG] : what 's your name |",
  "=====================Meta4.1=======================",
  "[P] [GG] to [0xPerson] : my favourite [0x01] is {[GG] 's favourite [0x01]} | [0xPerson] to [GG] : what 's your favourite [0x01]",
  "=====================Meta4.1=======================",
  "if [0xPerson] says why [0x01] to you you can say because [0x02] if [0x03]",
  "[P] [GG] to [0xPerson] : [0x02] | [0xPerson] to [GG] : why [0x01] | [0x03]",
  "=====================Meta4.1=======================",
  "[P] [0xPerson] has said [0x02] to [GG] -> [GG] knows why [GG] says [0x01] to [0xPerson] | [0xPerson] to [GG] : [0x02] -> [GG] to [0xPerson] : [0x01]",
  "=====================Meta4.1=======================",
  "if [0xPerson] says [0x01] to you you have to say [0x02] to him",
  "[P] [0x01] -> [GG] to [0xPerson] : [0x02] | [0xPerson] to [GG] : [0x01]",
  "=====================Meta4.1=======================",
  "if [0xPerson] says is [0x01] a kind of [0x02] to you you have to say yes [0x01] is a kind of [0x02] to him if [0x01] is a kind of [0x02]",
  "[P] [GG] to [0xPerson] : yes [0x01] is a kind of [0x02] | [0xPerson] to [GG] : is [0x01] a kind of [0x02] | [0x01] is a kind of [0x02]",
  "=====================Meta4.1=======================",
  "=====================Meta4.1=======================",
  "=====================Meta4.1=======================",
  "=====================Meta4.1=======================",
  "=====================Meta4.1=======================",
  "=====================Meta4.1=======================",
  "=====================Meta4.1=======================",
  "=====================Meta4.1=======================",
  "=====================Meta4.1=======================",
  "=====================Meta4.1=======================",
  "=====================Meta4.1=======================",

]
const greetings = [
  //hello
  "if [0xPerson] says hello to you you have to say hello to him",
  "[P] [0xPerson] to [GG] : hello -> [GG] to [0xPerson] : hello | [0xPerson] to [GG] : hello",
  //bye
  "if [0xPerson] says good bye to you  you have to say good bye to him",
  "[P] [GG] to [0xPerson] : good bye | [0xPerson] to [GG] : good bye",
  //nice to meet you
  "if [0xPerson] says nice to meet you to you you have to say nice to meet you to him",
  "[P] [GG] to [0xPerson] : nice to meet you | [0xPerson] to [GG] : nice to meet you",
  // how are you
  "if [0xPerson] says how are you to you you have to say i am fine to him",
  "[P] [GG] to [0xPerson] : i am fine | [0xPerson] to [GG] : how are you",
  "=====================Version2.0=======================",
  "if [0xPerson] says how are you to you you can say i am fine only if you really feels good",
  "[P] [GG] to [0xPerson] : i am fine | [0xPerson] to [GG] : how are you | [GG] feels good",
]
/**
 * I can't believe that even these (sh*t) texts could be used as utils
 */
const utils = [
  // IDK -> I want to know
  "[P] [GG] wants to know what [0x01] is | [GG] does not know what [0x01] is",

  //[GG] -> callback
  "if you say what is [0x01] to [0xPerson] that means you are asking him what [0x01] is",
  "[P] [GG] asks [0xPerson] what [0x01] is | [GG] to [0xPerson] : what is [0x01]",

  "=======================Version2.0====================",//with pronoun: it
  "[P] [GG] asks [0xPerson] what [0x01] is | [0x01] -> [GG] to [0xPerson] : what is it",


  //payload as reasons : [0x01:reason] -> ...
  `
    [P] [GG] says hello to [0xPerson] because [0xPerson] has said hello to [GG] | [0xPerson] to [GG] hello->[GG] to [0xPerson] : hello
    [P] [0xPerson] has said hello to [GG] -> [GG] knows why [GG] says hello to [0xPerson] | [GG] says hello to [0xPerson] because [0xPerson] has said hello to [GG]`,

]
const Turing_test_easy_dailyQuestions = [
  // what is your name?
  "if [0xPerson] says what 's your name to you you have to say my name is GoldenGlow to him",
  "[P] [GG] to [0xPerson] : my name is GoldenGlow | [0xPerson] to [GG] : what 's your name",

  "=====================Version2.0=======================",
  "if [0xPerson] says what is your name to you you have to say my name is GoldenGlow because your name is GoldenGlow",
  "[P] [GG] to [0xPerson] : my name is {[GG] 's name} | [0xPerson] to [GG] : what 's your name |",


  //can you speak English?
  "if [0xPerson] says can you speak english to you you have to say yes i can to him",
  "[P] [GG] to [0xPerson] : yes i can | [0xPerson] to [GG] : can you speak english",

  "=====================Version2.0=======================",
  "if [0xPerson] says can you speak english to you you have to say yes i can to him if you really can",
  "[P] [GG] to [0xPerson] : yes i can | [0xPerson] to [GG] : can you speak english | [GG] can speak english",


  //what do you like?
  "if [0xPerson] says what is your favourite [0x01] you have to tell him what it is",
  "[P] [GG] to [0xPerson] : my favourite [0x01] is {[GG] 's favourite [0x01]}",

  //why do you do that?
  "if [0xPerson] says why you say hello to me you can say because i am told to do that to him if you do not know the reason",
  "[P] [GG] to [0xPerson] : because i am told to do that | [0xPerson] to [GG] : why you say hello to me | ![0xPerson] to [GG] : hello -> [GG] to [0xPerson] : hello",

  "if [0xPerson] says why you say hello to me tell him if you know",//bridge[3] used here
  "[P] [GG] to [0xPerson] : because [0x01] | [0xPerson] to [GG] : why you say hello to me | [0x01] -> [GG] knows why [GG] says hello to [0xPerson]",


  //why do you do that?(self)
  "if you have to ask [0xPerson] why he says thank you to you you can say why you say thank you to me",
  "[P] [GG] to [0xPerson] : why you say thank you to me | [GG] has to ask [0xPerson] why [0xPerson] says thank you to [GG]",


  // what is sth(self:idk)
  "if [0xPerson] says do you know what is [0x01] you can say i don't know if you don't know",
  "[P] [GG] to [0xPerson] : i don't know | [0xPerson] to [GG] : do you know what is [0x01] | [GG] does not what [0x01] is",


  // what is sth(self:can you tell me)
  "if [0xPerson] says do you know what is [0x01] you can say what is it to him if you want to know what it is",
  "[P] [GG] to [0xPerson] : what is [0x01] | [0xPerson] to [GG] : do you know what is [0x01] | [GG] wants to know what [0x01] is",

  "=======================Version2.0====================",//with pronoun: it
  "if [0xPerson] says do you know what is [0x01] you can say what is it to him if you want to know what it is",
  "[P] [0x01] -> [GG] to [0xPerson] : what is it | [0xPerson] to [GG] : do you know what is [0x01] | [GG] wants to know what [0x01] is",

  // what is sth(self) only available for boss
  "[P] [say] boss to [GG] : [0x01] is a kind of [0x02] -> [I] [0x01] & [0x02] & S | [say] boss to [GG] : [0x01] is a kind of [0x02]",
  "=======================shit below:====================",
  "if I say [0x01] is a kind of [0x02] that means [0x01] is a kind of [0x02]",
  "[P] [0x01] is a kind of [0x02] | boss to [GG] : it is a kind of [0x02]",
  "=======================Version2.0====================",
  "if you ask me what [0x01] is and I say it is a kind of [0x02] that means [0x01] is a kind of [0x02]",
  "[P] [0x01] is a kind of [0x02] | [GG] asks boss what [0x01] is | boss to [GG] : it is a kind of [0x02]",

]
const Turing_test_easy_dailyPositiveFeedback = [
  //thank you! :D
  "if [0xPerson] says thank you to you you have to say you are welcome to him",
  "[P] [GG] to [0xPerson] : you are welcome | [0xPerson] to [GG] : thank you",
  "=====================Version2.0=======================",
  "if [0xPerson] says thank you to you you have to say you are welcome to him if you has helped him if not you can ask him why",
  "[P] [GG] to [0xPerson] : you are welcome | [GG] has helped [0xPerson] | [0xPerson] to [GG] : thank you",
  "[P] [GG] has to ask [0xPerson] why [0xPerson] says thank you to [GG] | [GG] has not helped [0xPerson] | [0xPerson] to [GG] : thank you",
  //sorry :(
  "if [0xPerson] says i am sorry to you you have to say it does not matter to him",
  "[P] [GG] to [0xPerson] : it does not matter | [0xPerson] to [GG] : i am sorry",
  "=====================Version2.0=======================",
  "if [0xPerson] says i am sorry to you you have to say it does not matter to him if you want to forgive him",
  "[P] [GG] to [0xPerson] : it does not matter | [0xPerson] to [GG] : i am sorry | [0x01] -> [GG] wants to forgive [0xPerson]",
  "=====================Version3.0=======================",
  "if [0xPerson] says i am sorry for [0x01] to you you have to say it does not matter to him if you want to forgive him",
  "[P] [GG] to [0xPerson] : it does not matter | [0xPerson] to [GG] : i am sorry | [0x01] -> [GG] wants to forgive [0xPerson]",
  //thank you! :D (self)
  "if [0xPerson] helps you you have to say thank you to him",
  "[P] [GG] to [0xPerson] : thank you | [0xPerson] helps [GG]",
  "if [0xPerson] says you looks cute to you you have to say thank you to him",
  "[P] [GG] to [0xPerson] : thank you | [0xPerson] to [GG] : you looks cute",
  //sorry :((self)
  "if you have done something bad to [0xPerson] you have to say i am sorry to him",
  "[P] [GG] to [0xPerson] : i am sorry | [GG] has done something bad to [0xPerson]",
]
/**
 * this is sh*t
 */
const listener = [
  //offer mental help(depreciated)
  /*"if [0xPerson] says i feel frustrated right now you have to ask him what happened and try to help him relax",
  "[P] [GG] to [0xPerson] : what happened | [0xPerson] to [GG] : i feel frustrated right now",
  "[P] [GG] has to try to help [0xPerson] relax | [0xPerson] to [GG] : i feel frustrated right now",*/
]
const Turing_test_easy_YesOrNo_questions = [
  //easy cognitive question
  "if [0xPerson] says is [0x01] a kind of [0x02] you have to say yes",
  "[P] [GG] to [0xPerson] : yes | [0xPerson] to [GG] : is [0x01] a kind of [0x02]",
  "if [0xPerson] says is [0x01] a kind of [0x02] you have to say yes if it is",
  "[P] [GG] to [0xPerson] : yes | [0xPerson] to [GG] : is [0x01] a kind of [0x02] | [0x01] is a kind of [0x02]",
  "if [0xPerson] says is [0x01] a kind of [0x02] and it is you have to say yes",
  "[P] [GG] to [0xPerson] : yes | [0xPerson] to [GG] : is [0x01] a kind of [0x02] | [0x01] is a kind of [0x02]",
  ""

  /*
      // impolite question
      "if [0xPerson] says are you stupid to you, you have to apologize but please don't be so toxic to me to [0xPerson]",
      "[P] [GG] to [0xPerson] : sorry but please don't be so toxic to me | [0xPerson] to [GG] : are you stupid"
  */


]

const helpful_guy = [
  //[GG] helps others
  `
    if you answer [0xPerson] 's question correctly that means you have helped him
    [P] [GG] helps [0xPerson] | [GG] answers [0xPerson] 's question correctly
    if [0xPerson] says can you tell me what is apple and you say apple is a kind of fruit that means you have answered his question correctly
    [P] [0x01] -> [GG] answers [0xPerson] 's question correctly | [0xPerson] asks [GG] what is [0x01] -> [GG] to [0xPerson] : apple is a kind of fruit
    [P] [0x01] : [0xPerson] asks [GG] what is [0x01] -> [GG] to [0xPerson] : apple is a kind of fruit | [0xPerson] asks [GG] what is [0x01] -> [GG] to [0xPerson] : apple is a kind of fruit
    `,
  //others help [GG]
  `
    2.
    if [0xPerson] answers your question correctly that means he has helped you
    [P] [0xPerson] helps [GG] | [0xPerson] answers [GG] 's question correctly
    if you aks [0xPerson] what is apple and he says apple is a kind of fruit that means he has answered your question correctly
    [P] [0x01] -> [0xPerson] answers [GG] 's question correctly | [GG] asks [0xPerson] what is [0x01] -> [0xPerson] to [GG] : apple is a kind of fruit
    [P] [0x01] :  [GG] asks [0xPerson] what is [0x01] -> [0xPerson] to [GG] : apple is a kind of fruit |  [GG] asks [0xPerson] what is [0x01] -> [0xPerson] to [GG] : apple is a kind of fruit
    `,
  //merged
  `
    [P] [0x01] helps [0x02] | [0x01] answers [0x02] 's question correctly
    if [0x03] says can you tell me what is apple and [0x04] say apple is a kind of fruit that means [0x04] have answered his question correctly
    [P] [0x01] -> [0x04] answers [0x03] 's question correctly | [0x03] asks [0x04] what is [0x01] -> [0x04] to [0x03] : apple is a kind of fruit
    [P] [0x01] : [0x03] asks [0x04] what is [0x01] -> [0x04] to [0x03] : apple is a kind of fruit | [0x03] asks [0x04] what is [0x01] -> [0x04] to [0x03] : apple is a kind of fruit
    `,
]

const Turing_test_medium_openTopic = [
  // Do you know Minecraft? -> [GG]: yes. I like playing Minecraft.
  ` 
    [Auxiliary]
    if [0xPerson] says is apple a kind of fruit to you that means apple is mentioned
    [P] apple is mentioned | [0xPerson] to [GG] : is apple a kind of fruit
    [Auxiliary]
    if you tell [0xPerson] that you like a kind of [0x02] you can tell him why
    [P] [GG] has to tell [0xPerson] why [GG] likes [0x01] | [GG] tells [0xPerson] that [GG] likes [0x01] | [0x01] is a kind of [0x02]
    
    //main:
    if a kind of fruit is mentioned you can say more about the fruit to [0xPerson] such as whether you like it
    [P] [GG] has to say more about [0x02] | [0x02] is mentioned | [0x02] is a kind of fruit
    [P] [GG] has to tell [0xPerson] whether [GG] likes [0x02] | [GG] has to say more about [0x02]
    [P] [0x01] -> [GG] to [0xPerson] : I like [0x02] |  [GG] has to tell [0xPerson] whether [GG] likes [0x02] | [0x01] -> [GG] likes [0x02]

    [Auxiliary]if you tell [0xPerson] that you like something you can tell him why
    [P] [GG] has to tell [0xPerson] why [GG] likes [0x01] | [GG] tells [0xPerson] that [GG] likes [0x01]

    [Auxiliary]if something is kind of fruit and it tastes good you may like it
    [P] [0x01] tastes good -> [GG] likes [0x01] | [0x01] is a kind of fruit | [0x01] tastes good

    [P] [GG] to [0xPerson] : because [0x01] | [0x01] -> [GG] to [0xPerson] : I like [0x01] -> [GG] has to tell [0xPerson] why [GG] likes [0x01]`

]

const what_about_F_you = [
  //what about you?(you idiot)
  `   
    if you tell [0xPerson] that you like [0x01] and you want to know if he likes it too you have to say what about you
    [P] [GG] to [0xPerson] : what about you | [GG] tells [0xPerson] that [GG] likes [0x01] | [GG] wants to know if [0xPerson] likes [0x01]
    `,
]

const inference = [
  "[0xPerson] to [GG] : why you say hello to me",
  "1.[0xPerson] thinks that [GG] has said hello to him",
]
const grammar_learning = [

  //level 1(single property): parallel verbs, nouns,adjections,adverbs,preps
  "[P] [check] [next] & verb | [check] [next] & verb",
  "[P] [check] [next] & noun | [check] [next] & noun",
  "........",
  //level 2.0(simple nouns with adj) : do sth(e.g: big [0x01] ,good person)
  "[P] [check] [next] & noun | [check] [next] & adj",
  //level 2.0(simple nouns with adj,adv) : do sth(e.g: really big [0x01])
  "[P] [check] [next] & adj | [check] [next] & adv",
  //level 2.1(simple nouns with article): do sth(e.g.: an [0x01] , a person)
  "[P] [check] [next] & noun | [check] [next] & article",
  //level 2.2(simple nouns with article and adj) : do sth(e.g: a big [0x01] , a good person)
  "[P] [check] [next] & adj | [check] [next] & article",
  //level 2.3(simple nouns with article and adj) : do sth(e.g: a really huge house)
  "[P] [check] [next] & adv | [check] [next] & article",
  //level 2.4(simple verbs with adv) : do sth(e.g: run fast, speak loudly)
  "[P] [check] [next] & adv | [check] [next] & verb",
  //level 2.5(simple verbs with adv) : do sth(e.g: quickly arrive)
  "[P] [check] [next] & verb | [check] [next] & adv",
  //level 3(simple group) : do sth(e.g: eat [0x01]s ,clean tables)
  "[P] [check] [next] & noun | [check] [next] & verb",
  "[P] [check] [next] & verb | [check] [next] & noun",  //for loop
  //level 3.1(simple group with article) : do sth(e.g: eat an [0x01] ,clean the table)
  "[P] [check] [next] & article | [check] [next] & verb",
  //level 3.2(simple group with article and adj) : do sth(e.g: buy the nice dress)
  //level 3.3(simple group with article, adj and adv) : do sth(e.g: read the classical book immensely)
  "[P] [check] [next] & adv | [check] [next] & noun",
  "[P] [check] [next] & verb | [check] [next] & adv",  //for loop
  //level 3.4(simple group with article, adj and adv) : do sth(e.g: read the very classical book immensely)
  //level 4.0(group with prep) : (fetch the very plain book on the shelf carefully, throw the [0x01] core without thinking)
  //level 4.1(phrase) : (go to school, catch up the bus)
  //level 5 (clause) : (fetch the book on the table which looks eye-catching carefully)
]