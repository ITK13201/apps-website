## 1. wrangler.toml の修正

- [x] 1.1 `wrangler.toml` に `main = ".open-next/worker.js"` を追加し、ファイルに設定が存在することを確認する
- [x] 1.2 `wrangler.toml` の `compatibility_date` を `2025-01-01` 以降の日付に更新し、ローカルで `pnpm wrangler deploy --dry-run` を実行して警告が出なくなることを確認する

## 2. package.json へのデプロイスクリプト追加

- [x] 2.1 `package.json` の `scripts` に `"deploy:cloudflare": "opennextjs-cloudflare deploy"` を追加し、`pnpm run deploy:cloudflare` でコマンドが認識されることを確認する

## 3. 動作確認

- [x] 3.1 ローカルで `pnpm run build:cloudflare` を実行し、`.open-next/worker.js` が生成されることを確認する
- [ ] 3.2 変更を main ブランチにプッシュし、Cloudflare Pages のデプロイログで `Failed: error occurred while running deploy command` エラーが発生しなくなることを確認する
