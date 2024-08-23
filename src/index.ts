/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
      try {
        // メッセージ(msg)を受け取った何らかの処理
        console.log(msg.body);
        msg.ack();
      } catch (e) {
        // エラーハンドリング
        msg.retry();
      }
    }
  },
  async fetch(request, env) {
    const message = {
      url: request.url,
      method: request.method,
    };
    await env.MY_QUEUE.send(message);
    return new Response('Success!');
  },
} satisfies ExportedHandler<Env>;
