## Why

Cloudflare Pages のデプロイコマンド `npx wrangler deploy` が `Missing entry-point to Worker script or to assets directory` エラーで失敗している。`wrangler.toml` に `main` フィールドが設定されていないため、wrangler が OpenNext でビルドされた Worker スクリプトのエントリーポイントを認識できない。

## What Changes

- `wrangler.toml` に `main = ".open-next/worker.js"` を追加し、OpenNext ビルド成果物をエントリーポイントとして指定する
- `package.json` に `deploy:cloudflare` スクリプトを追加し、`opennextjs-cloudflare deploy` を直接実行できるようにする（Cloudflare Pages のデプロイコマンドとして使用可能）
- `wrangler.toml` の `compatibility_date` を最新の日付に更新する（現在 `2024-12-18` で警告が出ている）

## Capabilities

### New Capabilities

（なし — 純粋なデプロイ設定の修正であり、アプリケーションの機能・動作に変更はない）

### Modified Capabilities

（なし — spec レベルの要件変更はない）

## Impact

- **`wrangler.toml`**: `main` フィールドの追加、`compatibility_date` の更新
- **`package.json`**: `deploy:cloudflare` スクリプトの追加
- Cloudflare Pages のデプロイが成功するようになる
- アプリケーションコード・依存関係への変更なし
