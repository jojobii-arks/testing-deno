import { connect } from "https://deno.land/x/redis@v0.27.4/mod.ts";
import sample from "https://deno.land/x/lodash@4.17.15-es/sample.js";

const redis = await connect({
  hostname: "0.0.0.0",
  port: 6379,
});

// console.log(await redis.xtrim("logs", { elements: 100 }));
console.log(await redis.xlen(`logs:bold_khayyam.adult`));
console.log(await redis.xrevrange(`logs:bold_khayyam.adult`, "+", "-"));

1669318308807;
1669318302222;
