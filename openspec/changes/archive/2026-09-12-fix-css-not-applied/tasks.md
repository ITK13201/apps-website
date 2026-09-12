## 1. wrangler.toml の修正

- [x] 1.1 `wrangler.toml` に `[assets]` セクション（`directory = ".open-next/assets"`, `binding = "ASSETS"`）を追加し、ファイルに保存されていることを確認する
- [x] 1.2 `compatibility_flags` に `global_fetch_strictly_public` を追加し、既存の `nodejs_compat` と共存していることを確認する

## 2. デプロイと動作確認

- [ ] 2.1 `pnpm deploy:cloudflare` を実行してデプロイが成功することを確認する（wrangler の出力にエラーがないこと）
- [ ] 2.2 ブラウザで `https://apps.i-tk.dev/` を開き、Tailwind CSS のスタイルが正しく適用されていることを目視で確認する
