import {ContainerVariant} from "@/src/types";

export const ParallelReg = {
  parallel: /^\[(0x\d+)]$/,
  node: /^\[(\d+)]$/
}

export const NODE_TYPE = {
  TRIGGER: `trigger`,
  RESULT: `result`,
} as const;

export const containerVariantsNormal: ContainerVariant[] = [
  {
    rule: ParallelReg.parallel,
    containerType: "parallel",
  }
]
