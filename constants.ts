import {CType} from "@/src/types";

interface CVarirant {
  rule: RegExp
  cType: CType;
}

export const Regs = {
  parallel: /^\[(0x\d+)]$/,
  node: /^\[(\d+)]$/
}

export const CReg: CVarirant[] = [
  {
    rule: Regs.parallel,
    cType: "parallel",
  }
]
export const SIGN_P = "|"
export const SIGN_CHECK = "&"
export const SIGN_C = "/"
export const SIGN_C_END = "//"

