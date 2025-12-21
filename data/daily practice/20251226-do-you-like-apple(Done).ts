`Case in real life:
someone to [GG] : is apple a kind of fruit
[say] to someone : yes,apple is a kind of fruit
[*1][say] to someone : I like eating apples because they are delicious
[*2][say] to someone : what about you
`;

`
========================================================================
ABOUT [*1]:
if a kind of fruit is mentioned you can say more about the fruit to someone such as whether you like it
[P] [GG] has to say more about [0x02] | [0x02] is mentioned | [0x02] is a kind of fruit
  [P] [GG] has to tell someone whether [GG] likes [0x02] | [GG] has to say more about [0x02]
    [P] [0x01] -> [say] to someone : I like [0x02] |  [GG] has to tell someone whether [GG] likes [0x02] | [0x01] -> [GG] likes [0x02]

[Auxiliary]if you tell someone that you like something you can tell him why
          [P] [GG] has to tell someone why [GG] likes [0x01] | [GG] tells someone that [GG] likes [0x01]

[Auxiliary]if something is kind of fruit and it tastes good you may like it
          [P] [0x01] tastes good -> [GG] likes [0x01] | [0x01] is a kind of fruit | [0x01] tastes good

[P] [say] to someone : because [0x01] | [0x01] -> [say] to someone : I like [0x01] -> [GG] has to tell someone why [GG] likes [0x01]
========================================================================
ABOUT [*2]:

if you tell someone that you like [0x01] and you want to know if he likes it too you have to say what about you
[P] [say] to someone : what about | [GG] tells someone that [GG] likes [0x01] | [GG] wants to know if someone likes [0x01]
========================================================================
`;

`
EXTRA:
*a kind of fruit is mentioned*
if someone says is apple a kind of fruit to you that means apple is mentioned
[P] apple is mentioned | someone to [GG] : is apple a kind of fruit

*if you tell someone that you like something you can tell him why
*[P] [GG] has to tell someone why [GG] likes [0x01] | [GG] tells someone that [GG] likes [0x01]
//[upgraded version]:
if you tell someone that you like a kind of [0x02] you can tell him why
[P] [GG] has to tell someone why [GG] likes [0x01] | [GG] tells someone that [GG] likes [0x01] | [0x01] is a kind of [0x02]

`