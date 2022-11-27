import { connect } from "https://deno.land/x/redis@v0.27.4/mod.ts";

const redis = await connect({
  hostname: "0.0.0.0",
  port: 6379,
});

console.log("hi");

console.time("process");

const validmembers = await redis.zrangebyscore(
  "hosts",
  (await redis.time())[0],
  "+inf",
);
const allmembers = await redis.zrange("hosts", 0, -1);

console.log("all members", allmembers.length);

console.log("valid members", validmembers.length);
// console.log("valid members", membersValid.length);

console.timeEnd("process");
