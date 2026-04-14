import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const mobileRoot = resolve(process.cwd());

const files = {
  "App.js": {
    type: "CODE",
    contents: readFileSync(resolve(mobileRoot, "App.js"), "utf8")
  },
  "src/data/cases.js": {
    type: "CODE",
    contents: readFileSync(resolve(mobileRoot, "src/data/cases.js"), "utf8")
  },
  "src/lib/progress.js": {
    type: "CODE",
    contents: readFileSync(resolve(mobileRoot, "src/lib/progress.js"), "utf8")
  }
};

const params = new URLSearchParams({
  dependencies: "expo-blur,expo-status-bar,react-native-safe-area-context",
  files: JSON.stringify(files),
  hideQueryParams: "true",
  name: "BissTrainer Challenge 5",
  platform: "ios",
  preview: "true",
  supportedPlatforms: "ios,android,web"
});

const url = `https://snack.expo.dev/?${params.toString()}`;
const outputPath = resolve(mobileRoot, "snack-url.txt");

writeFileSync(outputPath, `${url}\n`, "utf8");
console.log(outputPath);
