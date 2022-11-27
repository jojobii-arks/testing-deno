import { connect } from "https://deno.land/x/redis@v0.27.4/mod.ts";
import { generateName } from "https://deno.land/x/docker_names@v1.1.0/mod.ts?source";
import { sleep } from "https://deno.land/x/sleep@v1.2.1/mod.ts";
const redis = await connect({
  hostname: "0.0.0.0",
  port: 6379,
});

while (true) {
  await redis.lpush("messages", generateName());
  await sleep(0.25);
}
