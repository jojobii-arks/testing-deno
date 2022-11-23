import { sleep } from "https://deno.land/x/sleep@v1.2.1/sleep.ts";
import connection from "../lib/connection.ts";

const channel = await connection.openChannel();

console.log("connected!");

const { queue } = await channel.declareQueue({
  queue: "producer",
  autoDelete: true,
});
await channel.declareExchange({ exchange: "fanning", type: "fanout" });
await channel.bindQueue({ queue: queue, exchange: "fanning" });

let count = 0;
while (count <= 25) {
  await sleep(0.25);
  console.log({ id: count });
  await channel.publish(
    { exchange: "fanning" },
    {
      contentType: "application/json",
    },
    new TextEncoder().encode(JSON.stringify({
      id: count++,
    })),
  );
}

await channel.close();

Deno.exit();
