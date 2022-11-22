import env from "./env.ts";
import { connect } from "https://deno.land/x/redis@v0.27.4/mod.ts";
const redis = await connect({
  hostname: env.REDIS_HOST,
  port: env.REDIS_PORT,
});
export default redis;
