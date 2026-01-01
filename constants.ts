export const Regs = {
  parallel: /^\[0x[a-zA-Z0-9-*]+]$/,
  node: /^\[(\d+)]$/,
  iGet: /^\{[\s\S]+}$/
}

export const SIGN_P = "|"
export const SIGN_CHECK = "&"
export const SIGN_C = "/"
export const SIGN_C_END = "//"
export const SIGN_C_EXTEND='*'  //[0x*05-1]

export const IDENTITY="[I]"
export const BELONG='=>'
export const NOT_BELONG='!=>'
export const UNKNOWN = '[UNK]'
export const SIGN_I_GET=['AsKey','AsVal']


export const SIGN_INVERSE_NODE="!"

