## Context

`@opennextjs/cloudflare` v1.x は Cloudflare Workers with Static Assets 方式でデプロイする。この方式では `wrangler.toml` に `[assets]` セクションを設定することで、静的ファイル（CSS・JS・フォント・画像）を Cloudflare CDN から直接配信し、動的リクエストのみ Worker へ転送する。

現状の `wrangler.toml` には `[assets]` セクションが存在しないため、静的アセットが CDN にバインドされておらず、すべてのリクエストが Worker の Next.js ハンドラーに渡される。`/_next/static/css/` へのリクエストも Worker が受け取るが、Next.js サーバーは CSS ファイルをそのまま返す機能を持たないため、ブラウザは正しい CSS を受け取れない。

公式テンプレート（`node_modules/@opennextjs/cloudflare/templates/wrangler.jsonc`）では `assets.directory = ".open-next/assets"` と `assets.binding = "ASSETS"` を必須フィールドとして定義している。

## Goals / Non-Goals

**Goals:**
- `wrangler.toml` に `[assets]` セクションを追加し、`.open-next/assets` を静的アセットディレクトリとして登録する
- 公式テンプレートに倣い `global_fetch_strictly_public` 互換フラグを追加する

**Non-Goals:**
- ビルド設定・アプリコードの変更
- CDN キャッシュ戦略の変更（`_headers` ファイルは既に設定済み）

## Decisions

### `[assets]` セクションの追加

`wrangler.toml` に以下を追加する：

```toml
[assets]
directory = ".open-next/assets"
binding = "ASSETS"
```

`@opennextjs/cloudflare` の deploy コマンドは内部で `wrangler deploy` を実行するため、wrangler.toml の `[assets]` 設定が直接使われる。`binding = "ASSETS"` は Worker コード側でアセットバインディングを参照する際の名前であり、`@opennextjs/cloudflare` のワーカーテンプレートが期待する値と一致する。

### `global_fetch_strictly_public` フラグの追加

公式テンプレートが推奨するフラグ。Workers からの fetch リクエストを公開インターネット経由に制限するセキュリティ設定。既存の `nodejs_compat` と併せて設定する。

**代替案**: フラグを追加しない → 今は動作するが、Cloudflare のデフォルト挙動が変わった際に予期しない内部ルーティングが起こりうる。リスクが低いため追加する。

## Risks / Trade-offs

- **リスク**: `binding = "ASSETS"` の名前が Worker コードの期待する名前と異なると動作しない → `@opennextjs/cloudflare` の公式テンプレートと同じ値を使用することで回避済み
- **リスク**: 設定変更後に再デプロイが必要 → 実装後 `pnpm deploy:cloudflare` を実行するだけでよく、ダウンタイムは発生しない

## Migration Plan

1. `wrangler.toml` を編集して `[assets]` セクションと互換フラグを追加
2. `pnpm deploy:cloudflare` を実行して再デプロイ
3. ブラウザで `https://apps.i-tk.dev/` を開き CSS が適用されることを確認

ロールバック: 前のコミットに戻して再デプロイすれば元の状態に戻る（CSS は引き続き壊れたままになるが）。
