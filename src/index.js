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

		// 共通のCORSヘッダー
		const corsHeaders = {
			"Access-Control-Allow-Origin": "https://zzz.tunakaniri.com",
			"Access-Control-Allow-Methods": "GET",
			"Access-Control-Allow-Headers": "Content-Type",
			"Content-Type": "application/json"
		};

		// OPTIONSリクエスト（プリフライト）への対応
		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: corsHeaders
			});
		}

		// 許可していないメソッド
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			return new Response(JSON.stringify({
				error: 'Only GET and HEAD requests are allowed'
			}), {
				status: 405, // Method Not Allowed
				headers: {
					...corsHeaders,
					'Allow': 'GET, HEAD'
				}
			});
		}

		// 必須クエリパラメータ一覧
		const requiredParams = [
			'authkey_ver',
			'sign_type',
			'authkey',
			'lang',
			'region',
			'game_biz',
			'size',
			'real_gacha_type',
			'end_id'
		];

		// クエリに含まれている全キー
		const actualParams = Array.from(url.searchParams.keys());

		// 足りないパラメータ
		const missingParams = requiredParams.filter(key => !url.searchParams.has(key));

		// 不要なパラメータ（＝actualにあるけどrequiredにないもの）
		const extraParams = actualParams.filter(key => !requiredParams.includes(key));

		if (missingParams.length > 0 || extraParams.length > 0) {
			return new Response(JSON.stringify({
				error: 'Invalid query parameters',
				missing: missingParams,
				unexpected: extraParams
			}), {
				status: 428,
				headers: corsHeaders
			});
		}

		// ここからAPI通信
		const targetUrl = `https://public-operation-nap-sg.hoyoverse.com/common/gacha_record/api/getGachaLog` + url.search; // クエリパラメータをそのまま転送

		// APIリクエストを作成
		const response = await fetch(targetUrl, {
			method: "GET"
		});

		// 外部APIからのContent-Typeを維持しつつCORSヘッダー追加（推奨）
		const withAPIHeaders = new Headers(response.headers);
		for (const [key, value] of Object.entries(corsHeaders)) {
			withAPIHeaders.set(key, value);
		}
		// CORSヘッダーを追加
		return new Response(response.body, {
			status: response.status,
			headers: withAPIHeaders
		});
	},
};
