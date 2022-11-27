import { connect } from "https://deno.land/x/redis@v0.27.4/mod.ts";
import { generateName } from "https://deno.land/x/docker_names@v1.1.0/mod.ts?source";

const redis = await connect({
  hostname: "0.0.0.0",
  port: 6379,
});

console.log(await redis.lpush("list", generateName()));
