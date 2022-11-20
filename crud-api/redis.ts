import { connect } from "https://deno.land/x/redis@v0.27.4/mod.ts";
const redis = await connect({
  hostname: "redis",
  port: 6379,
});
export default redis;
