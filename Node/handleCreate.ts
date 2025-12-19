import {SIGN_P} from "@/src/constants";
import {handlerN, handlerP, handlerR} from "../handleDB";
import {Row_N} from "../types";
import {applyBatch} from "../decorator/applyBatch";

async function createGrid(rv: string[], tv: string[]): Promise<number> {
  let [t, r]: [Row_N[], Row_N[]] = [[], []]
  const F = applyBatch()(handlerN.create.bind(handlerN));
  await Promise.resolve().then(async () => {

    t = (await F(tv))!
  }).then(async () => {

    r = (await F(rv) as Row_N[])!
  })
  const R = await handlerR.create()

  const P_T = t.map(e => handlerP.create(R!.id, e.id, "trigger"))
  const P_R = r.map(e => handlerP.create(R!.id, e.id, "result"))
  await Promise.all([...P_T, ...P_R])
  return R!.id
}

async function clearGrid(id: number) {
  const P = await handlerP.findByR(id);
  await Promise.all(
      P.map(async (p) => {
        await handlerP.delete(p.id);
      })
  )
}

const NVP_P = (nv: string): string[] => {
  return nv.split(SIGN_P).map(Val => Val.trim());
}

const classifyNV = (patches: string[]): [string, string[]] => {
  return [patches[0], patches.slice(1)];
}


export async function handleCreate(nv: string): Promise<number> {
  const [r, t] = classifyNV(NVP_P(nv));
  return createGrid([r], t)
}

`==============================================================`
/**
 * data with Parallel container is not allowed
 */
const td = `[GG] has to wash the dishes | the dinner is over | the guests have left`
const runTest = async () => {
  await handleCreate(td);
}
const md = `boss to [GG] : | [check] [next] & boss`
const runMeta = async () => {
  await handleCreate(md);
}


runMeta()
    .then(async () => {
      const td1 = "[2] hi | boss to [GG] : | [check] [next] & hi"
      await handleCreate(td1)
    })
    .then(async () => {
      let d1 = (await handlerN.findByVal("boss to [GG] :"))?.id!
      const td2 = {
        triggers: [
          `boss to [GG] :`,
          "[check] [next] & [GG]"
        ],
        results: [
          `[${d1}] [0x01]`,
          "[0x01] : [GG]"
        ]
      }
      await createGrid(td2.results, td2.triggers)
    })
    .then(async () => {
      let d1 = (await handlerN.findByVal("boss to [GG] :"))?.id!
      const td2 = {
        triggers: [
          `[${d1}] [0x01]`,
          "[check] [next] & [GG]"
        ],
        results: [
          "[0x01] : [GG]"
        ]
      }
      await createGrid(td2.results, td2.triggers)
    })
