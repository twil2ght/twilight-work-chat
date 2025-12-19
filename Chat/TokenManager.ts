// TokenManager.ts
class TokenManager {
  private static nextTokens: string[];
  private static history: string[];

  static {
    this.nextTokens = ["[start]","boss", "hi","[GG]"];
    this.history = [];
    console.log("[TokenManager] 静态初始化完成，nextTokens初始值：", this.nextTokens);
  }

  static get(): string | undefined {
    if (!this.nextTokens) this.nextTokens = [];
    return this.nextTokens[0];
  }

  static add(token: string) {
    if (!this.nextTokens) this.nextTokens = [];
    this.nextTokens.push(token);
  }

  static shift(): string | undefined {
    if (!this.nextTokens) this.nextTokens = [];
    const token = this.nextTokens.shift();
    if (token) {
      console.log("[out]:", token);
      if (!this.history) this.history = [];
      this.history.push(token);
    }
    return token;
  }

  static getLength(): number {
    console.log("nextTokens：", this.nextTokens);


    if (!this.nextTokens) this.nextTokens = [];
    return this.nextTokens.length;
  }

  static getHistory(): string[] {
    if (!this.history) this.history = [];
    return [...this.history];
  }
}

export const next_tokens = {
  get: TokenManager.get.bind(TokenManager), // 绑定this
  add: TokenManager.add.bind(TokenManager)  // 绑定this
};

// 核心修复：给每个方法绑定this到TokenManager
export const TokenApi = {
  shift: TokenManager.shift.bind(TokenManager),
  getLength: TokenManager.getLength.bind(TokenManager), // 关键！绑定this
  getHistory: TokenManager.getHistory.bind(TokenManager)
};