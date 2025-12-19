import { chatInit } from "./module/init";
import { chatExToken_In } from "./module/ex_token_in";
import { Node } from "../Node";
import { Container } from "../container";
import { unregisterRelation } from "./module/unregisterRelation";
import { register_legacy } from "./module/register_legacy";
// 导入独立的Token模块（核心修改）
import { next_tokens, internalTokenApi } from "./TokenManager";
import {showcase} from "../utils";

// --- 枚举定义 ---
const enum Event {
  INIT,
  EXTERNAL_WORD_GET_IN,
  REGISTER_REV_LEGACY,
  UNREGISTER_RELATION,
  NOTHING,
}

// --- 接口定义 ---
export interface Legacy {
  result: Node[];
  container: Container[];
}

interface Options {
  legacy: Legacy[];
}

// --- 核心聊天逻辑 ---
const chat = async (currentState: Event, opt: Options): Promise<{ nextEvent: Event; newOptions: Options }> => {
  let nextState: Event;
  let newOptions = opt;

  switch (currentState) {
    case Event.INIT: {
      console.log("[mode]:init")
      await chatInit();
      nextState = Event.UNREGISTER_RELATION;
      await showcase()
      console.log(`===========================================`)
      break;
    }

    case Event.EXTERNAL_WORD_GET_IN: {
      console.log("[mode]:ex_word_get_in")
      await chatExToken_In();
      nextState = Event.UNREGISTER_RELATION;
      await showcase()
      console.log(`===========================================`)
      break;
    }

    case Event.UNREGISTER_RELATION: {
      console.log("[mode]:unregister")
      const legacy = unregisterRelation();
      if (legacy.length > 0) {
        newOptions = { ...opt, legacy };
        nextState = Event.REGISTER_REV_LEGACY;
      } else {
        if (internalTokenApi.getLength() > 0) {
          internalTokenApi.shift(); // 消费Token
          nextState = Event.EXTERNAL_WORD_GET_IN;
        } else {
          nextState = Event.NOTHING;
        }
      }
      await showcase()
      console.log(`===========================================`)
      break;
    }

    case Event.REGISTER_REV_LEGACY: {
      console.log("[mode]:legacy get")
      await register_legacy(opt.legacy!);
      nextState = Event.UNREGISTER_RELATION;
      await showcase()
      console.log(`===========================================`)
      break;
    }

    default:
      console.log("[mode]:nothing")
      nextState = Event.NOTHING;
      console.log(`===========================================`)
      break;
  }

  return { nextEvent: nextState, newOptions };
};

// --- 聊天服务类 ---
class ChatService {
  private currentState: Event = Event.INIT;
  private currentOptions: Options = { legacy: [] };
  private isRunning: boolean = false;

  public async trigger(startState?: Event) {
    if (startState) {
      this.currentState = startState;
    }
    if (this.isRunning) return;

    this.isRunning = true;
    await this.run();
    this.isRunning = false;
  }

  private async run() {
    while (this.currentState !== Event.NOTHING) {
      const { nextEvent, newOptions } = await chat(this.currentState, this.currentOptions);

      this.currentOptions = newOptions;
      this.currentState = nextEvent;
    }
  }
}

// 导出单例和token对象（next_tokens来自独立模块）
export { next_tokens };
export const chatService = new ChatService();
// 建议在入口文件调用trigger，避免模块加载时执行
// chatService.trigger();