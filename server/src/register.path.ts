import { register } from "tsconfig-paths";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tsconfig = JSON.parse(
  readFileSync(join(__dirname, "../tsconfig.json"), "utf8")
);

register({
  baseUrl: tsconfig.compilerOptions.baseUrl || "./",
  paths: tsconfig.compilerOptions.paths || {},
});
