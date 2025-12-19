import {Container} from "../Container";
import {isParalHead} from "../utils";
import {next_tokens} from "../Chat";
import {Zip_C} from "../types";
import {SIGN_C_END, SIGN_C} from "@/src/constants";
const isNext=(nv:string):boolean=>{
  return nv==="[next]"
}
const getNext=():string=>{
  console.log("[next] value:",next_tokens.get())
  return next_tokens.get()!
}


function toPatches(cv: string) {
  const cvf = cv.split(SIGN_C_END)[0];
  return cvf
      .split(SIGN_C)
      .map(val => val.trim());
}
function parallelMapper(cs: Container[], nv: string): string[] {

  const nvp = nv.split(" ");
  const processedNvp = nvp.map(e =>
      isNext(e) ? getNext() : e
  );


  const rules: { index: number; options: string[] }[] = [];

  processedNvp.forEach((e, index) => {
    const sign = isParalHead(e);
    if (sign === "parallel") {
      const c = cs.find(c => c.zip().k === e);
      if (c && c.executable()) {
        const options = toPatches(c.zip().val)
            .map(opt => opt.trim())
            .filter(opt => opt); // 过滤空字符串，避免无效选项
        if (options.length > 0) {
          rules.push({ index, options });
        }
      }
    }
  });


  if (rules.length === 0) {
    return [processedNvp.join(" ")];
  }

  let resultNodes: string[][] = [[]];

  for (let pos = 0; pos < processedNvp.length; pos++) {
    const currentPart = processedNvp[pos];
    const rule = rules.find(r => r.index === pos);
    const tempResults: string[][] = [];

    for (const combo of resultNodes) {

      const valuesToInsert = rule ? rule.options : [currentPart];

      for (const value of valuesToInsert) {
        tempResults.push([...combo, value]);
      }
    }
    resultNodes = tempResults;
  }


  return resultNodes.map(arr => arr.join(" "));
}

export function RPM(nv: string, cs: Container[]): string[] {

  const flatResults = parallelMapper(cs, nv);

  const finalResults: string[] = [];

  for (const res of flatResults) {

    const hasC = res.split(" ").some(e => {
      const sign = isParalHead(e);
      return sign !== undefined &&
          cs.some(c => c.zip().k === e);
    });

    if (!hasC) {

      finalResults.push(res);
    } else {

      const deeperResults = RPM(res, cs);
      finalResults.push(...deeperResults);
    }
  }

  return finalResults;
}

`===========================================================================================================================`

/**
 * TESTING
 */
// --- 测试数据定义 ---

const testData = `[GG] has to wash the dishes | the dinner is over | the guests have left`;
const testData_withContainer = `[GG] has to wash the [0x01] | the dinner is over | the guests have left`;

/**
 * [0x01] V1: 基础并行内容
 */
const container_content = `dishes / forks / chopsticks //`;

/**
 * [0x01] V2: 包含嵌套引用
 */
const container_content2 = `dishes / [0x02] / chopsticks //`;

/**
 * [0x02]: 子容器内容
 */
const container_child = `fork1 / fork2 / fork3 //`;

// 注意：这里为了测试清晰，我将两个 [0x01] 分开定义，或者在测试时明确选择
// 如果你的 container 类内部会处理同 ID 覆盖，请忽略此注释
const containerConfigs: Zip_C[] = [
  {
    k: "[0x01]",
    val: container_content,
    type: "parallel",
    name: "Base Container",
  },
  {
    k: "[0x01]",
    val: container_content2,
    type: "parallel",
    name: "Nested Container",
  },
  {
    k: "[0x02]",
    val: container_child,
    type: "parallel",
    name: "Child Container",
  },
];


const getContainer = (config:Zip_C):Container => {
  return new Container(config.k,config.name,config.type,config.val)
}
/**
 * 运行测试并打印结果
 */
function runTest() {
  console.log("🚀 开始运行 parallelMapper 递归测试...\n");

  // --- CASE 1: 无容器 ---
  console.log("🧪 测试用例 1: 无容器输入");
  console.log("输入:", testData);
  const result1 = RPM(testData, []);
  console.log("输出:", result1);
  console.log("✅ 预期: 返回原字符串数组。实际数量:", result1.length, "\n");

  // --- CASE 2: 单层容器 ---
  console.log("🧪 测试用例 2: 单层容器 [0x01] (dishes/ forks/ chopsticks)");
  console.log("输入:", testData_withContainer);
  const container1 = getContainer(containerConfigs[0]); // 使用 V1
  const result2 = RPM(testData_withContainer, [container1]);

  console.log("输出:");
  result2.forEach((res, idx) => console.log(`  ${idx + 1}. ${res}`));
  console.log("✅ 验证: 应该生成 3 条语句 (对应 dishes, forks, chopsticks)。实际数量:", result2.length, "\n");

  // --- CASE 3: 嵌套容器 ---
  console.log("🧪 测试用例 3: 嵌套容器 [0x01] 内部引用 [0x02]");
  console.log("输入:", testData_withContainer);

  // 这里需要同时传入父容器(V2)和子容器
  const container2 = getContainer(containerConfigs[1]); // 使用 V2 (包含 [0x02])
  const container3 = getContainer(containerConfigs[2]); // [0x02]
  const result3 = RPM(testData_withContainer, [container2, container3]);

  console.log("输出 (预期展开为 dishes, fork1/2/3, chopsticks 的组合):");
  result3.forEach((res, idx) => console.log(`  ${idx + 1}. ${res}`));

  // 简单的逻辑判断：如果嵌套成功，数量应该是 1(父容器的dishes) + 3(子容器的fork) + 1(父容器的chopsticks) = 5?
  // 实际逻辑取决于你的 parallelMapper 是如何处理 "/" 和 "//" 的。
  // 通常 "//" 代表“或”，所以 [0x01] V2 有 3 个选项，其中中间那个选项被替换成了 3 个选项。
  // 所以总结果数应该是: 1 (dishes) + 3 (forks) + 1 (chopsticks) = 5
  console.log("✅ 验证: 嵌套展开完成。实际数量:", result3.length, "\n");

  // --- CASE 4: 边界测试 (容器不存在) ---
  console.log("🧪 测试用例 4: 引用不存在的容器");
  const result4 = RPM(testData_withContainer, []);
  console.log("输出:", result4);
  console.log("✅ 验证: 当容器不存在时，ID 应该保持原样或被移除（取决于你的逻辑）。实际:", result4, "\n");
}

// --- 执行测试 ---
runTest();