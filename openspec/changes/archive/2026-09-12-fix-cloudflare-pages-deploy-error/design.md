## Context

OpenNext for Cloudflare は Next.js アプリを Cloudflare Workers 向けにビルドし、`.open-next/worker.js` にエントリーポイントを生成する。wrangler はこのファイルを `wrangler.toml` の `main` フィールドで参照する必要があるが、現在の設定にはその記述が欠けている。

動機は `proposal.md` を参照。

## Goals / Non-Goals

**Goals:**
- `wrangler.toml` の設定を修正して Cloudflare Pages デプロイを成功させる
- 不要な `npx` 呼び出しを排除し、ローカルインストールされた wrangler を使うスクリプトを追加する

**Non-Goals:**
- Cloudflare Pages のビルド設定（UI 側）の変更
- アプリケーションコード・ルーティング・PWA 設定の変更
- KV/R2 などの Cloudflare バインディングの設定

## Decisions

### `wrangler.toml` に `main` を追加する

OpenNext の公式ドキュメントでは、`wrangler.toml` に `main = ".open-next/worker.js"` を指定することで wrangler が Worker スクリプトのエントリーポイントを認識できる。

**採用理由**: デプロイコマンドを変更せずに解決できる最小限の変更。

**代替案**: デプロイコマンドを `pnpm opennextjs-cloudflare deploy` に変更する方法もあるが、Cloudflare Pages の UI 設定も変更が必要になる。

### `deploy:cloudflare` スクリプトを `package.json` に追加

`pnpm run deploy:cloudflare` で `opennextjs-cloudflare deploy` を実行できるようにする。Cloudflare Pages のデプロイコマンドとして設定可能な形にする。

**採用理由**: `npx wrangler deploy` を使い続けることも可能だが、`package.json` にスクリプトを定義することで意図が明確になり、ローカルの wrangler バイナリを使用できる。

### `compatibility_date` の更新

現在 `2024-12-18` で警告が出ている。`2025-01-01` 以降の日付に更新することで警告を解消する。

## Risks / Trade-offs

- **`compatibility_date` 変更によるランタイム差異** → Worker の動作が変わる可能性があるが、この変更は後方互換性があり、最新の修正・機能が有効になるのみ。デプロイ後に動作確認する。
- **`.open-next/worker.js` のパスの固定** → OpenNext のビルド出力先が変更された場合に追従が必要。現時点では OpenNext の仕様として固定されているため問題なし。
