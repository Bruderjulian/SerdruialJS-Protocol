import { readFile } from "fs/promises";
import pathsage from "path-sage";

export async function run(path) {
  let data = await readFile(path, "utf8");
  return data
    .split(/#{2,}/)
    .slice(1, 3)
    .map((b) => parse(b))
    .reduce((a, v) => {
      return ({ ...a, ...v});
    }); 
}

function parse(blob) {
  const data = blob.split("\n").filter((s) => s.length != 0);
  let output= {};
  for (let i = 0; i < data.length; i++) {
    const elem = data[i];
    const path = elem.substring(0, elem.indexOf("="));
    const value = toNumber(elem.substring(elem.indexOf("=") + 1));
    pathsage.create(output, path);
    pathsage.set(output, path, value);
  }
  for (const key of Object.keys(output)) {
    if (output[key].vid && output[key].pid) {
      output[key]["idPairs"] = Object.keys(output[key].vid).map((k) => ({
        vid: output[key].vid[k],
        pid: output[key].pid[k],
      }));
    }
  }
  return output;
}

function toNumber(n) {
  try {
    const temp = parseInt(n);
    return typeof temp === "number" &&!isNaN(temp) ? temp : n;
  } catch (e) {
    return n;
  }
}