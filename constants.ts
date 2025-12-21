
interface CVarirant {
  rule: RegExp
}

export const Regs = {
  parallel: /^\[0x[a-zA-Z0-9-]+]$/,
  node: /^\[(\d+)]$/
}

export const CReg: CVarirant[] = [
  {
    rule: Regs.parallel,
  }
]
export const SIGN_P = "|"
export const SIGN_CHECK = "&"
export const SIGN_C = "/"
export const SIGN_C_END = "//"

