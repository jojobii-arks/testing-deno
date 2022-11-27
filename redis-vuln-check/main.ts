import { connect } from "https://deno.land/x/redis@v0.27.4/mod.ts";
const redis = await connect({
  hostname: "0.0.0.0",
  port: 6379,
});

console.log(await redis.get("example; del example"));

//! WE'RE GOOD LOL
