import { connect } from "https://deno.land/x/amqp@v0.21.0/mod.ts";
import pingUntilSuccess from "./pingUntilSuccess.ts";

const connection = await pingUntilSuccess(
  5,
  () =>
    connect({
      hostname: "rabbitmq",
      port: 5672,
      username: "guest",
      password: "guest",
      heartbeatInterval: 5,
    }),
);

export default connection;
