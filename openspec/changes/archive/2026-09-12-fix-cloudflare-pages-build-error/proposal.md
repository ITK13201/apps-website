## Why

Cloudflare PagesのビルドがOpenNextを使用（`pnpm opennextjs-cloudflare build`）しているが、`next.config.ts`は`output: "export"`（静的エクスポート）を指定しているため、OpenNextが期待する`.next/standalone/`ディレクトリが生成されず、`pages-manifest.json`が見つからないエラーが発生している。Cloudflare Pagesへのデプロイを安定させるため、ビルド構成を一貫した状態に修正する必要がある。

## What Changes

- `next.config.ts`から`output: "export"`を削除し、OpenNext/Cloudflare Workersと互換性のある設定に変更
- `@opennextjs/cloudflare`をdevDependenciesに追加し、ローカルでもビルドを再現可能にする
- `wrangler.toml`を追加してCloudflare Workersのデプロイ設定を定義
- `open-next.config.ts`を追加してOpenNextのビルド設定を明示
- `package.json`のビルドスクリプトを更新（`preview`スクリプトをローカル確認用に追加）
- `trailingSlash: true`および`images.unoptimized: true`は維持（Cloudflareでも有効）
- PWA（`@ducanh2912/next-pwa`）はstandaloneモードでも動作するが、`fallbacks.document`の静的ファイルは別途対応が必要

## Capabilities

### New Capabilities

なし（このチェンジはビルドツーリングのみの修正で、ユーザー向け機能の変更はない）

### Modified Capabilities

なし

> **Note**: `skip_specs: true`を設定済み。純粋なビルド設定の修正でありユーザー向け挙動の変更はない。PWAのオフライン挙動に影響が生じた場合は`pwa-core`スペックを別途更新すること。

## Impact

- `next.config.ts`: `output: "export"`および`trailingSlash`、`images`設定の調整
- `package.json`: `@opennextjs/cloudflare`追加、ビルドスクリプト更新
- `wrangler.toml`（新規）: Cloudflare Workers設定
- `open-next.config.ts`（新規）: OpenNextビルド設定
- `.node-version`: 既存のNode.js 24指定を維持
- `public/_headers`、`public/_redirects`: 引き続き有効
