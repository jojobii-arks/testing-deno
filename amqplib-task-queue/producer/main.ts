import { sleep } from "https://deno.land/x/sleep@v1.2.1/mod.ts";
import connection from "../lib/connection.ts";

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
