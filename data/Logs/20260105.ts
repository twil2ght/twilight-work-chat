`
1.[passed] simNodes maybe activated by many times and if the containers are totally the same, then it makes no sense
2. write code to handle the EXTEND container
3.how to deal with pronouns
6.introduce !Node
7.try to solve {I_GET}
4.test {[GG] 's name}
5.test extremely easy [unknown]
8.test easy !Node
9.finish the grammar rules
666.collect all the signs which have been used in the project
`;

`
2.
✅️[DONE]
[0x03] is mentioned in boss \\'s and [GG] \\'s talk',
[0x*03] : [0x01] / [0x02] //'   
in this case, there is no link between [0x01] and [0x02], SO just Split them before pagination

[P] [GG] has to say more about [0x01] to boss | [0x01] is mentioned in boss \\'s and [GG] \\'s talk | [IFlow] [0x01] => [0x02]

6. 
✅️[DONE]
    E.g:    original Version:  node(ID:5): [1] hello  
            inverse Version:   node(ID:6): [5] !
            
7.
✅️[DONE]

(1)asking general answering specific
[P] [say] [GG] to boss : [0x05] | [say] boss to [GG] : what [0x02] do you know
[P] [0x05] : {[0x01]&AsKey} //


(2)asking specific answering general
[P] [say] [GG] to boss : [0x01] is a kind of [0x05] | [say] boss to [GG] : what is [0x01]
[P] [0x05] : {[0x01]&AsVal} //

4.
STEP 1(easy):
[P] [say] [GG] to boss : [0x01] is a kind of [0x05] | [say] boss to [GG] : what is [0x01]
[P] [0x05] : {[0x01]&AsVal} //

STEP 2(hard)
[P] [say] boss to [GG] : your [0x02] is [0x01] -> [I] [0x01] & [GG] 's [0x02] & S | [say] boss to [GG] : your [0x02] is [0x01]

if i say what is your name you have to tell me that your name is GoldenGlow because your name is GoldenGlow instead of sth else
[P] [say] [GG] to boss : my name is [0x01] | [say] boss to [GG] : what is your name
[P] [0x01] : {[GG] 's name AsKey} //

STEP 3(hell)
[say] boss to [GG] : if you find some words appear both in the condition and in the result that means they are linked


5.
    E.g:[GG] has to say more about [0x01] to boss
       ⚠️it should trigger the [unknown] module as expected

    [P] [say] [GG] to boss : how do I [0x01] | [unknown] [GG] has to [0x01] to boss

9.

`