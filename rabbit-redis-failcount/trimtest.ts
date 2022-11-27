import { connect } from "https://deno.land/x/redis@v0.27.4/mod.ts";

const redis = await connect({
  hostname: "0.0.0.0",
  port: 6379,
});
console.log(await redis.xtrim("example", { elements: 3, approx: false }));

// await redis.xadd("example", "*", { message: "first" });
// await redis.xadd("example", "*", { message: "second" });
// await redis.xadd("example", "*", { message: "third" });
// await redis.xadd("example", "*", { message: "fourth" });
// await redis.xadd("example", "*", { message: "fifth" });
// await redis.xadd("example", "*", { message: "sixth" });
// await redis.xadd("example", "*", { message: "seventh" });
// await redis.xadd("example", "*", { message: "eigth" });

console.log(await redis.xrange("example", "-", "+"));

// console.log(await redis.xrange("example", "-", "+"));
