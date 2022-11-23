import { BASIC_ACK } from "https://deno.land/x/amqp@v0.21.0/src/amqp_constants.ts";
import connection from "../lib/connection.ts";
import randomString from "../lib/randomstring.ts";

const channel = await connection.openChannel();

const queueName = randomString(5);

const { queue } = await channel.declareQueue({
  queue: queueName,
  autoDelete: true,
});
await channel.declareExchange({
  exchange: "fanning",
  type: "fanout",
});
await channel.bindQueue({ queue: queue, exchange: "fanning" });

await channel.consume(
  { queue: queue },
  async (args, _props, data) => {
    const raw = new TextDecoder().decode(data);
    const parsed = JSON.parse(raw);
    console.log(parsed);
    await channel.ack({ deliveryTag: args.deliveryTag });
  },
);
