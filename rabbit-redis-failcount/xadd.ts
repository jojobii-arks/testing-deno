import { connect } from "https://deno.land/x/redis@v0.27.4/mod.ts";
import sample from "https://deno.land/x/lodash@4.17.15-es/sample.js";

const redis = await connect({
  hostname: "0.0.0.0",
  port: 6379,
});

const members = await redis.zrange("hosts", 0, -1);

function getRandomMember() {
  return sample(members);
}

console.time("process");

let count = 0;
while (count <= 5000) {
  console.log(count);
  const member = getRandomMember();
  const pl = redis.pipeline();
  pl.xadd(`logs:${member}`, "*", {
    type: sample(["success", "success", "success", "error"]),
    member: member,
    timestamp: ((await redis.time())[0]),
  });
  pl.xtrim(`logs:${member}`, { elements: 100, approx: false });
  console.log(await pl.flush());
  count++;
}

console.timeEnd("process");

// 11701, 15284;
