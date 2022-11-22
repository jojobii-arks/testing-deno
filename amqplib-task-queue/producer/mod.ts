import { connect } from "https://deno.land/x/amqp@v0.21.0/mod.ts";
import ShortUniqueId from "https://esm.sh/short-unique-id@3";
import { sleep } from "https://deno.land/x/sleep@v1.2.1/mod.ts";

const uid = new ShortUniqueId();

const connection = await connect({
  hostname: "localhost",
  port: 5672,
  username: "guest",
  password: "guest",
});
const channel = await connection.openChannel();

const queueName = "my.queue";
await channel.declareQueue({ queue: queueName });

let count = 0;

while (count <= 1000) {
  await sleep(0.1);
  console.log(count);
  await channel.publish(
    { routingKey: queueName, mandatory: true },
    { contentType: "application/json" },
    new TextEncoder().encode(JSON.stringify(count++)),
  );
}

await connection.close();
