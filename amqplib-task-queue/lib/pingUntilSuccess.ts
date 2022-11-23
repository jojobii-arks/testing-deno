import { sleep } from "https://deno.land/x/sleep@v1.2.1/mod.ts";

export default async function pingUntilSuccess(
  maxAttempts: number,
  // deno-lint-ignore no-explicit-any
  promise: () => Promise<any>,
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
