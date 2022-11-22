import { connect } from "https://deno.land/x/amqp@v0.21.0/mod.ts";
import { SOFT_ERROR_CONTENT_TOO_LARGE } from "https://deno.land/x/amqp@v0.21.0/src/amqp_constants.ts";
import { sleep } from "https://deno.land/x/sleep@v1.2.1/mod.ts";

const connection = await connect({
  hostname: "localhost",
  port: 5672,
  username: "guest",
  password: "guest",
  heartbeatInterval: 5,
});
const channel = await connection.openChannel();

const queueName = "my.queue";
await channel.declareQueue({ queue: queueName });
await channel.consume(
  { queue: queueName },
  async (args: any, props: any, data: any) => {
    console.log("hi");
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
  },
);
