## Why

`wrangler.toml` に `[assets]` セクション（静的ファイルのディレクトリとバインディング）が設定されていないため、デプロイ後に CSS・JS・画像などの静的ファイルがすべて Worker に転送されてしまい、ブラウザが正しい CSS を受け取れない状態になっている。`@opennextjs/cloudflare` の公式テンプレートが要求する `assets.directory` と `assets.binding` の両フィールドが欠落している。

## What Changes

- `wrangler.toml` に `[assets]` セクションを追加し、`directory = ".open-next/assets"` および `binding = "ASSETS"` を設定する
- 公式テンプレートに従い `global_fetch_strictly_public` 互換フラグを追加する

## Capabilities

### New Capabilities

なし（外部から観測可能な振る舞いの追加ではなく、既存の静的ファイル配信の修正）

### Modified Capabilities

なし（spec レベルの要件変更なし。純粋なデプロイ設定の修正）

## Impact

- `wrangler.toml` のみ変更
- 次回 `pnpm deploy:cloudflare` 時から CSS・JS・画像が Cloudflare の CDN から正しく配信される
- 既存のアプリコード・ルーティング・ビルド設定への影響なし
