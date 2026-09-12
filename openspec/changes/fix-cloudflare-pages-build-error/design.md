## Context

現在の状態（proposal.md参照）：
- `next.config.ts`に`output: "export"`が設定されており、静的ファイル（`out/`）を生成する
- Cloudflare PagesはOpenNext向けビルド（`pnpm opennextjs-cloudflare build`）を実行し、`.next/standalone/`を期待するが、`output: "export"`ではこのディレクトリが生成されない
- `@opennextjs/cloudflare`はCloudflare Pages CI環境で利用可能だが、package.jsonには含まれていない

制約：
- PWA（`@ducanh2912/next-pwa`）は継続してサポートする
- Cloudflare Pages dashboardのビルドコマンドは`pnpm opennextjs-cloudflare build`のまま（変更は不要）

## Goals / Non-Goals

**Goals:**
- `@opennextjs/cloudflare`のビルドが成功するようにNext.js設定を修正する
- ローカル環境でもOpenNextビルドを再現できるようにする
- `wrangler.toml`でCloudflare Workers設定を明示的に定義する
- PWA機能（service worker、オフラインページ）を維持する

**Non-Goals:**
- Cloudflare Pages dashboardの設定変更（コードで完結させる）
- アプリの機能追加や変更
- 既存のUIやルーティングの変更

## Decisions

### 1. `output: "export"` を削除する

**決定**: `next.config.ts`から`output: "export"`を削除し、OpenNextがデフォルトの`.next/`ビルド出力を使用できるようにする。

**理由**: OpenNextは`next build`の通常出力（Pages RouterまたはApp Router）を変換してCloudflare Workersにデプロイする。`output: "export"`はこの処理に必要な`.next/standalone/`ディレクトリを生成しないため除去する。

**代替案**:
- Cloudflare Pages設定を静的エクスポート用（`pnpm build`, output=`out`）に変更する案は、dashboardの変更が必要で管理が煩雑になるため却下。
- `output: "standalone"`に変更する案は不要（OpenNextが内部で管理するため）。

### 2. `trailingSlash: true` は維持

**決定**: `trailingSlash: true`はOpenNextでも有効であり、既存のURLパターンを変えないため維持する。

### 3. `images.unoptimized: true` の扱い

**決定**: Cloudflare Workersでは画像最適化はサポートされないため`images.unoptimized: true`は維持する。

### 4. `wrangler.toml` を新規追加

**決定**: Workers設定を`wrangler.toml`に明示的に定義する。最低限 `name`、`compatibility_date`、`compatibility_flags` を設定。

**理由**: `wrangler.toml`がないとOpenNextビルドがデフォルト値を使用するが、明示的に管理することで設定の追跡・変更が容易になる。

### 5. `open-next.config.ts` を新規追加

**決定**: OpenNextのビルド設定ファイルを追加する。最低限の設定（デフォルト）で十分だが、将来的なカスタマイズの起点として作成する。

### 6. package.jsonにビルドスクリプトを追加

**決定**: `"build:cloudflare": "opennextjs-cloudflare build"` スクリプトを追加し、`@opennextjs/cloudflare` をdevDependenciesに追加する。

**理由**: ローカルでCloudflareビルドを再現・検証できるようにする。

### 7. PWA設定の維持

**決定**: `@ducanh2912/next-pwa`の設定は基本的に維持する。`fallbacks.document: "/offline.html"`はビルド時に`public/`に生成される静的ファイルを使用するため、standaloneモードでも動作する。

## Risks / Trade-offs

- **[Risk] PWAの`fallbacks`設定が機能しない可能性** → `next-pwa`がstandaloneビルドで`offline.html`を正しく生成するかを実装後に確認する。問題があれば`fallbacks`設定を削除する。

- **[Risk] Cloudflare Workers無料プランの制限** → Workersのリクエスト数・CPU時間に制限がある。静的エクスポートと比べてコスト面での違いに注意。

- **[Trade-off] 静的CDN配信からEdge実行へ** → 静的エクスポート時はCDNから直接配信されるが、OpenNextではEdge関数として実行される。レイテンシへの影響は軽微（Cloudflare Edgeは分散型）だが理論上のオーバーヘッドは増える。

## Migration Plan

1. `next.config.ts`の`output: "export"`を削除
2. `wrangler.toml`と`open-next.config.ts`を作成
3. `package.json`に`@opennextjs/cloudflare`追加とスクリプト更新
4. ローカルで`pnpm build:cloudflare`を実行してビルド成功を確認
5. Cloudflare PagesへのデプロイはGitへのpushで自動実行（dashboardの既存設定を利用）

**ロールバック**: `output: "export"`を元に戻し、Cloudflare Pages dashboardのビルドコマンドを`pnpm build`、出力ディレクトリを`out`に変更する。
