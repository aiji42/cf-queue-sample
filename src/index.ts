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

const BASE_DELAY_SEC = 30;

export default {
  async queue(batch, env) {
    // my-queue用の処理
    if (batch.queue === 'my-queue') {
      for (const msg of batch.messages) {
        try {
          // メッセージ(msg)を受け取った何らかの処理
          throw new Error('Something went wrong');
        } catch (e) {
          // エラーハンドリング
          msg.retry();
        }
      }
    }

    // DLQの処理
    if (batch.queue === 'my-dead-letter-queue') {
      for (const msg of batch.messages) {
        // 例: DLQにメッセージが格納されたことをメールで通知
        await env.MyMailService.send({
          to: 'admin@example.com',
          subject: `DLQ Alert: ${msg.id}`,
          body: `Message:\n${JSON.stringify(msg.body, null, 2)}`,
        });
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
