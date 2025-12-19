import {init} from "./module/init";
import {tryNs} from "./module/tryNodes";
import {Node} from "../Node";
import {Container} from "../Container";
import {tryRs} from "./module/tryRs";
import {registerLegacy} from "./module/register_legacy";
import {TokenApi, next_tokens} from "./TokenManager";
import {showcase} from "../utils";

// --- 枚举定义 ---
const enum Event {
  INIT,
  HasToken,
  REGISTER_LEGACY,
  TRY_REL,
  NOTHING,
}

// --- 接口定义 ---
export interface Legacy {
  rs: Node[];
  cs: Container[];
}

interface Options {
  legacy: Legacy[];
}

// --- 核心聊天逻辑 ---
const chat = async (cur: Event, opt: Options): Promise<{ next: Event; newOptions: Options }> => {
  let next: Event;
  let newOptions = opt;

  switch (cur) {
    case Event.INIT: {
      console.log("[mode]:init")
      await init();
      next = Event.TRY_REL;
      await showcase()
      console.log(`===========================================`)
      break;
    }

    case Event.HasToken: {
      console.log("[mode]:ex_word_get_in")
      await tryNs();
      next = Event.TRY_REL;
      await showcase()
      console.log(`===========================================`)
      break;
    }

    case Event.TRY_REL: {
      console.log("[mode]:unregister")
      const legacy = tryRs();
      if (legacy.length > 0) {
        newOptions = { ...opt, legacy };
        next = Event.REGISTER_LEGACY;
      } else {
        if (TokenApi.getLength() > 0) {
          TokenApi.shift(); // 消费Token
          next = Event.HasToken;
        } else {
          next = Event.NOTHING;
        }
      }
      await showcase()
      console.log(`===========================================`)
      break;
    }

    case Event.REGISTER_LEGACY: {
      console.log("[mode]:legacy get")
      await registerLegacy(opt.legacy!);
      next = Event.TRY_REL;
      await showcase()
      console.log(`===========================================`)
      break;
    }

    default:
      console.log("[mode]:nothing")
      next = Event.NOTHING;
      console.log(`===========================================`)
      break;
  }

  return { next: next, newOptions };
};

// --- 聊天服务类 ---
class ChatService {
  private cur: Event = Event.INIT;
  private curOpt: Options = { legacy: [] };
  private isRunning: boolean = false;

  public async trigger(state?: Event) {
    if (state) {
      this.cur = state;
    }
    if (this.isRunning) return;

    this.isRunning = true;
    await this.run();
    this.isRunning = false;
  }

  private async run() {
    while (this.cur !== Event.NOTHING) {
      const { next, newOptions } = await chat(this.cur, this.curOpt);

      this.curOpt = newOptions;
      this.cur = next;
    }
  }
}

// 导出单例和token对象（next_tokens来自独立模块）
export { next_tokens };
export const chatService = new ChatService();
// 建议在入口文件调用trigger，避免模块加载时执行
// chatService.trigger();