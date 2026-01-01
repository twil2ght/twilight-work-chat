`
1.
someone to [GG] : how are you
[say] to someone : i am fine
if someone says how are you to you you can say i am fine only if you really feels good


2.
someone to [GG] : what is your name
[say] to someone : my name is GoldenGlow
if someone says what is your name to you you have to say my name is GoldenGlow because your name is GoldenGlow


3.
someone to [GG] : thank you (for helping me)
[say] to someone : you are welcome
if someone says thank you to you you have to say you are welcome to him if you has helped him if not you can ask him why
[P] [say] to someone : you are welcome | [GG] has helped someone | someone to [GG] : thank you
[P] [GG] has to ask someone why someone says thank you to [GG] | [GG] has not helped someone | someone to [GG] : thank you


4.
someone to [GG] : hello
someone to [GG] hello->[say] to someone : hello
someone to [GG] : why you say hello to me
[say] to someone : because i am told to do so    
if someone says why you say hello to me tell him if you know or you can say because i am told to do that if not
[P] [say] to someone : because i am told to do that | someone to [GG] : why you say hello to me | [GG] doesn't know why [GG] has to say hello to someone
[P] [say] to someone : because you said hello to me | someone to [GG] : why you say hello to me | someone to [GG] hello->[say] to someone : hello


5.(help feedback)
someone to [GG] : can you tell me what apple is
someone to [GG] : can you tell me what apple is -> [say] to [someone] : with pleasure , apple is a kind of fruit
someone to [GG] : can you tell me what apple is -> [say] to [someone] : with pleasure , apple is a kind of fruit -> [GG] has solved someone 's problem -> [GG] has helped someone
someone to [GG] : thank you
[say] to someone : you are welcome


20260103.
    [GG] has to tell boss whether she likes [0x02]
    ⚠️here comes the problem : this node is general-used so you have to make the [0x02] unique,
                                and make all nodes linked to it follow its name of containers.
    FAILED(❌️)🚀here is the solution 1: modify the Function {guessDataV2} : at Step 1 , find if some existed nodes that is identical to the input
            E.g: existed:[GG] has to tell boss whether she likes [0x02]
                 input : [GG] has to tell boss whether she likes [0x05]   
            ---> replace input by existed and add the {new,old} to {ids}
            
            🚀here is the solution 2 : repetitive nodes are allowed but if one is activated then spread it
            
`


/*⚠️ the word "such" has not been learned
   if a kind of fruit is mentioned in our talk you can say more about the fruit to me such as whether you like it*/

;`✅️DONE
        [P] [GG] likes [0x01] | (some conditions)
        [P] [say] [GG] to boss : i like [0x02] | [GG] likes [0x02] | [GG] has to tell boss whether she likes [0x02]


about result node;
1. if extractR === [], do pagination
2. receiver: activate and extractR and get containers (Node for Register Relation)
3. specify the result node: unpacking -> registerNodesByVal
`;
`❓️[Problem]:
        [P] [GG] likes [0x05] | [0x05] => fruit
        InitIdentity() can't trigger the Relation above
  SOLUTION: pass the identity pair like pass tokens(one by one)
             E.g: apple => fruit   -->Tokenize: apple,=>,fruit,
`;

`✅️[DONE]
[say] [GG] to boss : yes it is | [say] boss to [GG] : is [0x01] a kind of [0x02] | [IFlow] [0x01] => [0x02]
[say] [GG] to boss : no it isn't | [say] boss to [GG] : is [0x01] a kind of [0x02] | [IFlow] [0x01] !=> [0x02]
[say] [GG] to boss : i don't know | [say] boss to [GG] : is [0x01] a kind of [0x02] | [check] [0x01] & [0x02] & [UNK]
[say] [GG] to boss : i don't know | [say] boss to [GG] : is [0x01] a kind of [0x02] | [check] [0x01] & [0x02] & [I]

    normal: 
            [56] hello | [55] [GG] | [check] [next] & hello
`;
`

    if I say is [0x01] a kind of [0x02] that means [0x01] and fruit is mentioned in our talk
        [P] [0x01] is mentioned in boss 's and [GG] 's talk | [say] boss to [GG] : is [0x01] a kind of [0x02]
        [P] [0x02] is mentioned in boss 's and [GG] 's talk | [say] boss to [GG] : is [0x01] a kind of [0x02]

            
    if a kind of [0x02] is mentioned in our talk you can say more about the [0x02] to me
        [P] [GG] has to say more about [0x01] to boss | [0x01] is mentioned in boss 's and [GG] 's talk | [0x01] => [0x02]
            
    if you want to say more about a kind of fruit you can tell me whether you like it
        [P] [GG] has to tell boss whether she likes [0x02] | [0x02] => fruit | [GG] has to say more about [0x02] to boss
    if you want to tell me whether you like something you can say i like the thing if you do or i don't like the thing if not
        [P] [say] [GG] to boss : i like [0x02] | [GG] likes [0x02] | [GG] has to tell boss whether she likes [0x02]
        [P] [say] [GG] to boss : i don't like [0x02] | [GG] doesn't likes [0x02] | [GG] has to tell boss whether she likes [0x02]        
    
`;
`✅️[DONE]
    if i say is sth a kind of [0x02] you have to say yes it is if it is true
    [P] [say] [GG] to boss : yes it is | [say] [GG] is [0x01] a kind of [0x02] | [0x01] => fruit
   (1) ⚠️[say] boss to [GG] : is [0x01] a kind of [0x02]⚠️

    (2)[P] [0x01] is mentioned in boss \\'s and [GG] \\'s talk | ⚠️[say] boss to [GG] : is [0x01] a kind of [0x02]⚠️
    (*2)[P] [0x01] is mentioned in boss \\'s and [GG] \\'s talk | ⚠️[say] boss to [GG] : is [0x01] a kind of fruit⚠️
    
    ❓️[question]: will (1) trigger (2) or (*2) ?
    💡ideally, we hope (1) could trigger (*2)
    😭sadly, only (2) can be triggered :(
    Man, what can I say?   
    Accept the reality!!!
    ✅️[solution 1]: now metaData is allowed to handleSay()
    ✅️[solution 2]: if a container is not registered in its relation,just ignore it and let it pass RPM()   
`;


`

`