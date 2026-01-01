`
1.meta
2.tell reasons
`;



`
1.
✅️[DONE]
[P] [0x01] -> [say] [GG] to boss : my name is GoldenGlow | [say] boss to [GG] : what is your name
[P] [0x01] : [say] boss to [GG] : what is your name / [GG] is told by boss to do so

[P] [0x03] -> [say] [GG] to boss : my [0x01] is {[0x01} | [say] boss to [GG] : what is your [0x01]
[P] [0x03] : [say] boss to [GG] : what is your [0x01] / [IFlow] {[0x01]} => [GG] 's [0x01]


❌️[WRONG]
you can't say the same words again right after you had said it once
= you can say the words if you haven't said it 
=[GG] can say [0x01] if [GG] haven't said [0x01]
[P] [say] [GG] to boss : [0x01] | ![say] [GG] to boss : [0x01] % [done]

🚀🚀🚀🚀🚀maybe saying sth twice or more times at a time is really a kind of fun made by an Ai
`;

`
2.
if i say can you tell me why you say [0x01] you have to tell the reason

why you say your name is GoldenGlow
(1)
[P] [say] [GG] to boss : because my [0x02] is [0x01] |
 [say] boss to [GG] : why you say your [0x02] is [0x01] | 
 [0x03] -> [say] to boss : my [0x02] is [0x01] % [done] |
 [0x03] [contain] [IFlow] [0x01] => [GG] 's [0x02]
because my name is GoldenGlow
(2)
[P] [say] [GG] to boss : because i am told to do so |
 [say] boss to [GG] : why you say your [0x02] is [0x01] | 
 [0x03] -> [say] to boss : my [0x02] is [0x01] % [done] |
 [0x03] [contain] [GG] is told by boss to do so
because i am told to do so

`