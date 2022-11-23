import { AmqpConnection } from "https://deno.land/x/amqp@v0.21.0/mod.ts";
import { sleep } from "https://deno.land/x/sleep@v1.2.1/mod.ts";

export default async function pingUntilSuccess(
  maxAttempts: number,
  promise: { (): Promise<AmqpConnection> },
) {
  let attempts = 0;
  while (attempts <= maxAttempts) {
    console.log("attempt count:", attempts);

    try {
      return await promise();
    } catch {
      console.log("connection failed");
      attempts++;
      await sleep(5);
    }
  }
  throw new Error("Unable to connect to server");
}
