import { connect } from "https://deno.land/x/redis@v0.27.4/mod.ts";
import { generateName } from "https://deno.land/x/docker_names@v1.1.0/mod.ts?source";
import { getAllDomains } from "https://deno.land/x/domain@0.2.0/mod.ts";

const redis = await connect({
  hostname: "0.0.0.0",
  port: 6379,
});

let count = 0;

const domains = getAllDomains();
const getRandomDomain = () =>
  domains[Math.floor(Math.random() * domains.length)];

const time = Number((await redis.time())[0]);
console.log(time);

await redis.del("hosts");

while (count <= 50) {
  const name = generateName() + getRandomDomain();
  console.log(name);
  const newtime = (Math.random() >= 0.25) ? time + 30 : time + 12000;
  await redis.zadd("hosts", newtime, name);
  const willExpireLater = Math.random() < 0.25;
  if (willExpireLater) await redis.set(`error:${name}`, "");
  count++;
}
