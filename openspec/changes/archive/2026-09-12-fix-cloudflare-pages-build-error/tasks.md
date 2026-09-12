## 1. 依存パッケージの追加

- [x] 1.1 `@opennextjs/cloudflare`をdevDependenciesに追加し（`pnpm add -D @opennextjs/cloudflare`）、`pnpm install`が成功することを確認する
- [x] 1.2 `package.json`に`"build:cloudflare": "opennextjs-cloudflare build"`スクリプトを追加し、スクリプト一覧に表示されることを確認する

## 2. Next.js設定の修正

- [x] 2.1 `next.config.ts`から`output: "export"`を削除し、`pnpm build`（`next build`）が`.next/`ディレクトリを生成することを確認する（`out/`ではなく`.next/standalone/`が生成されること）

## 3. OpenNext設定ファイルの追加

- [x] 3.1 `open-next.config.ts`を新規作成し、最低限の設定を記述する（`cloudflare-pages`をtargetとした設定）。ファイルが存在することで確認完了
- [x] 3.2 `wrangler.toml`を新規作成し、`name`・`compatibility_date`・`compatibility_flags`を定義する。ファイルが存在することで確認完了

## 4. ローカルビルド検証

- [x] 4.1 `pnpm build:cloudflare`を実行し、エラーなくビルドが完了すること（`.open-next/`ディレクトリが生成されること）を確認する
- [x] 4.2 `.open-next/`ディレクトリの内容を確認し、`worker.js`またはCloudflare Workers向けのバンドルファイルが含まれていることを確認する

## 5. PWA動作確認

- [x] 5.1 `pnpm build`後に`public/`ディレクトリに`offline.html`が生成されていることを確認する（`@ducanh2912/next-pwa`のfallbacks機能が動作していること）
- [x] 5.2 `offline.html`が存在しない場合は`next.config.ts`の`fallbacks`設定を削除し、その影響をdesign.mdのRisksに記録する
