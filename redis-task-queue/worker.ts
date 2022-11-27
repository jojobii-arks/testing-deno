import { connect } from "https://deno.land/x/redis@v0.27.4/mod.ts";
const redis = await connect({
  hostname: "0.0.0.0",
  port: 6379,
});

console.log("listening for messages...");

while (true) {
  const message = await redis.brpop(0, "messages");
  console.log("incoming message:", message);
}
