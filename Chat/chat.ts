import {init, initIdentity} from "./module/init";
import {tryNs} from "./module/tryNodes";
import {Node} from "../Node";
import {Container} from "../Container";
import {tryRs} from "./module/tryRs";
import {registerLegacy} from "./module/register_legacy";
import {TokenApi, TokenManager} from "./TokenManager"; // 导入新增方法
import {log} from "../utils";

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
    uuid: string;
    isLoop: boolean;
}

interface Options {
    legacy: Legacy[];
}

export const isDebug = 0


/**
 * @example:
 * execute all [check] -> try to unregister some relations -> get legacy and generate a bunch of new relations -> back to execute all [check]
 * @param cur
 * @param opt
 */
const chat = async (cur: Event, opt: Options): Promise<{ next: Event; newOptions: Options }> => {
    let next: Event;
    let newOptions = opt;

    switch (cur) {
        case Event.INIT: {
            console.assert(!isDebug, "===========================================[chat->mode->Init]===========================================")
            await init();
            await initIdentity()
            next = Event.HasToken;
            //await showcase()

            break;
        }

        case Event.HasToken: {
            console.assert(!isDebug, "===========================================[chat->mode->TryNodes]===========================================")
            if (TokenApi.getLength() > 0) {
                if (TokenApi.shift() === '//') {
                    await init()
                }
                if (isDebug) log.warn("\t\t[next]:", TokenManager.get())
                await tryNs();
                next = Event.TRY_REL;
                //await showcase()

            } else {
                next = Event.NOTHING
            }

            break;
        }

        case Event.TRY_REL: {
            console.assert(!isDebug, "===========================================[chat->mode->TryRel]===========================================")
            const legacy = await tryRs();
            if (legacy.length > 0) {
                newOptions = {...opt, legacy};
                next = Event.REGISTER_LEGACY;
            } else {
                next = Event.HasToken;
            }

            break;
        }

        case Event.REGISTER_LEGACY: {
            console.assert(!isDebug, "===========================================[chat->mode->RegisterLegacy]===========================================")
            await registerLegacy(opt.legacy!);
            next = Event.HasToken;

            break;
        }

        default:
            console.assert(!isDebug, "===========================================[chat->mode->nothing]===========================================")
            next = Event.NOTHING;

            break;
    }

    return {next: next, newOptions};
};

// --- 聊天服务类 ---
class ChatService {
    private cur: Event = Event.INIT;
    private curOpt: Options = {legacy: []};
    private isRunning: boolean = false;
    private hasPendingTokens: boolean = false; // 新增：待处理Token标记

    // 新增：标记有新Token待处理，并防抖触发
    public markPendingTokens() {
        this.hasPendingTokens = true;
        if (!this.isRunning) {
            this.trigger().then();
        }
    }

    public async trigger(state?: Event) {
        if (state) {
            this.cur = state;
        }
        if (this.isRunning) return; // 防重复执行

        this.isRunning = true;
        await this.run();
        this.isRunning = false;

        // 处理完后若还有新Token，再次触发
        if (this.hasPendingTokens) {
            await this.trigger();
        }
    }

    private async run() {
        this.hasPendingTokens = false; // 重置标记
        while (this.cur !== Event.NOTHING) {
            const {next, newOptions} = await chat(this.cur, this.curOpt);
            this.curOpt = newOptions;
            this.cur = next;

            // 处理中新增Token，重置标记继续处理
            if (this.hasPendingTokens) {
                this.hasPendingTokens = false;
            }
        }
    }
}

// 导出单例和Token操作方法
export const chatService = new ChatService();