import { BasicDeliverHandler } from "https://deno.land/x/amqp@v0.21.0/mod.ts";
import { sleep } from "https://deno.land/x/sleep@v1.2.1/mod.ts";
import connection from "../lib/connection.ts";

const channel = await connection.openChannel();

const queueName = "my.queue";
await channel.declareQueue({ queue: queueName });
await channel.consume(
  { queue: queueName },
  (async (args, _props, data) => {
    await sleep(2);
    const raw = new TextDecoder().decode(data);
    const parsed = JSON.parse(raw);
    console.log(parsed);
    if (Math.random() > 0.75) {
      console.log("nacking");
      await channel.nack({ deliveryTag: args.deliveryTag });
    } else {
      await channel.ack({ deliveryTag: args.deliveryTag });
    }
  }) as BasicDeliverHandler,
);
