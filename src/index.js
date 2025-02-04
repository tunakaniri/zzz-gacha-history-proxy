/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const targetUrl = `https://public-operation-nap-sg.hoyoverse.com/common/gacha_record/api/getGachaLog` + url.search; // クエリパラメータをそのまま転送

        // APIリクエストを作成
        const response = await fetch(targetUrl, {
            method: "GET"
        });

        // CORSヘッダーを追加
        return new Response(response.body, {
            status: response.status,
            headers: {
                "Access-Control-Allow-Origin": "https://zzz.tunakaniri.com",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Content-Type": "application/json",
            },
        });
    },
};


