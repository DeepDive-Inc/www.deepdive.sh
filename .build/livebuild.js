import { watch } from "chokidar";
import { BlueFoxDomGate } from "@xofeulb/bluefox-domgate";

let gate_map = [
  {
    index: "../components/index.html",
    out: "../index.html",
  },
];

watch("../components").on("all", async (event, path) => {
  console.log(event, path);
  gate_map.forEach((_) => {
    BlueFoxDomGate.connect(
      _.index,
      "../components",
      _.out,
      undefined,
      undefined,
      true
    );
  });
});
