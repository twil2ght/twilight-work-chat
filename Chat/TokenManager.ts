// TokenManager.ts
import {chatService} from "@/src/Chat/chat";

export class TokenManager {
  private static nextTokens: string[];
  private static history: string[];

  static {
    this.nextTokens = [];
    this.history = [];
  }

  // 批量添加Token（支持单个/多个）
  static addTokens(newTokens: string | string[]) {
    const tokensToAdd = Array.isArray(newTokens) ? newTokens : [newTokens];
    this.nextTokens.push(...tokensToAdd);
    // 通知ChatService有新Token待处理（关键：不直接触发，只标记）
    chatService.markPendingTokens();
  }

  static get(): string | undefined {
    if (!this.nextTokens) this.nextTokens = [];
    return this.nextTokens[0];
  }

  static shift(): string | undefined {
    if (!this.nextTokens) this.nextTokens = [];
    const token = this.nextTokens.shift();
    if (token) {
/*      console.log("[TokenManager->NextTokens->out]:", token);*/
      if (!this.history) this.history = [];
      this.history.push(token);
    }
    return token;
  }

  static getLength(): number {
    //console.log("[TokenManager->NextTokens]:", this.nextTokens);


    if (!this.nextTokens) this.nextTokens = [];
    return this.nextTokens.length;
  }

  static getHistory(): string[] {
   // console.log("[TokenManager->History]:",this.history)
    if (!this.history) this.history = [];
    return [...this.history];
  }
}

// 核心修复：给每个方法绑定this到TokenManager
export const TokenApi = {
  shift: TokenManager.shift.bind(TokenManager),
  getLength: TokenManager.getLength.bind(TokenManager), // 关键！绑定this
  getHistory: TokenManager.getHistory.bind(TokenManager),
  addToken: TokenManager.addTokens.bind(TokenManager),
};