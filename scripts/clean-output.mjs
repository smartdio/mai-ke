import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const outputDir = path.join(projectRoot, "_site");

fs.rmSync(outputDir, { recursive: true, force: true });
console.log(`已清理生成目录：${outputDir}`);
