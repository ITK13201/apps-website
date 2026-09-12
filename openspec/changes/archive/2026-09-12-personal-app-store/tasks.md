## 1. プロジェクトセットアップ

- [x] 1.1 `flake.nix` を作成して Node.js と pnpm を nix develop 環境で管理し、`nix develop` 後に `pnpm --version` が通ることを確認する
- [x] 1.2 Next.js 15 プロジェクトを App Router・TypeScript・Tailwind CSS v4 構成で初期化し、`pnpm dev` が起動することを確認する（Tailwind v4 は `global.css` の `@theme` ブロックでアクセントカラー `--color-brand: #0071E3` を定義する）
- [x] 1.3 `next.config.ts` に `output: 'export'` を設定し、`pnpm build` が静的出力（`out/` ディレクトリ）を生成することを確認する
- [x] 1.4 `@ducanh2912/next-pwa` を導入し、`public/manifest.json` を作成してブラウザの DevTools > Application でマニフェストが認識されることを確認する
- [x] 1.5 `next-themes` を導入し、`ThemeProvider` を `app/layout.tsx` に組み込む。システム設定に連動した初期テーマが適用されることを確認する
- [x] 1.6 Noto Sans JP を Google Fonts 経由で `app/layout.tsx` に追加し、日本語テキストが正しいフォントで表示されることをブラウザで確認する
- [x] 1.7 ESLint・Prettier を設定し `pnpm lint` がエラーなしで通ることを確認する

## 2. データモデルとアプリデータ

- [x] 2.1 `data/apps.json` の型定義ファイル（`types/app.ts`）を作成し、id / name / shortDescription / description / category / icon / screenshots / githubUrl（省略可）/ platforms フィールドを含む `App` 型を定義する
- [x] 2.2 `data/apps.json` に「ゴミの日」・「MoneyRabbit」を description・githubUrl 込みで追加し（GitHub リポジトリ URL は design.md 参照）、TypeScript の型チェックが通ることを確認する
- [x] 2.3 `lib/apps.ts` にアプリデータを読み込むユーティリティ関数（全件取得・ID 検索・カテゴリ一覧取得）を実装し、型エラーなしでビルドが通ることを確認する

## 3. アプリカタログ（一覧・カテゴリフィルター）

- [x] 3.1 トップページ（`app/page.tsx`）を実装し、アプリカードがグリッドレイアウト（モバイル 2 列・タブレット 3 列・デスクトップ 4 列）でアイコン・名前・プラットフォームバッジ・`shortDescription` を含む形で表示されることをブラウザで確認する
- [x] 3.2 カテゴリフィルター UI を実装し、カテゴリ選択時にそのカテゴリのアプリのみ表示され、「全て」選択で全件に戻ることをブラウザで確認する
- [x] 3.3 プラットフォームバッジコンポーネント（iOS / Android / Windows / macOS / Desktop Web / Mobile Web）を実装し、各バッジが正しいラベルで表示されることを確認する

## 4. アプリ詳細ページ

- [x] 4.1 `app/apps/[id]/page.tsx` を実装し、`generateStaticParams` で全アプリの静的ページが生成されることを確認する（`pnpm build` 後に `out/apps/<id>/index.html` が存在する）
- [x] 4.2 詳細ページにアプリ名・アイコン・`description`・カテゴリ・プラットフォーム別ダウンロードボタン・「ソースコードを見る」ボタン（`githubUrl` がある場合のみ表示）を実装し、各リンクが新しいタブで外部 URL を開くことをブラウザで確認する
- [x] 4.3 スクリーンショットギャラリーを実装し、スクリーンショットがある場合は横スクロール可能なギャラリーが表示され、ない場合はセクションが非表示になることを確認する
- [x] 4.4 存在しない ID へのアクセス時に Next.js の `notFound()` が発動し 404 ページが表示されることを確認する

## 5. 検索機能

- [x] 5.1 検索入力フィールドコンポーネントを実装し、キーワード入力に応じてアプリ一覧がリアルタイムにフィルタリングされることをブラウザで確認する（サーバーへの追加リクエストが発生しないこと）
- [x] 5.2 検索が大文字・小文字を区別しないこと、および一致なし時に空状態メッセージが表示されることを確認する
- [x] 5.3 検索とカテゴリフィルターの併用が正しく動作すること（AND 条件）をブラウザで確認する

## 6. PWA・オフライン対応

- [x] 6.1 `public/manifest.json` に name / short_name / icons / display / theme_color（`#0071E3`）/ background_color を設定し、Chrome DevTools の Lighthouse 監査で PWA の installability チェックが通ることを確認する
- [x] 6.2 Service Worker のキャッシュ戦略（アプリシェル + アプリデータを Cache First）を設定し、Chrome DevTools でオフラインモードにした際にアプリ一覧が表示されることを確認する
- [x] 6.3 オフライン時に未キャッシュページへアクセスした場合のフォールバックページ（`public/offline.html`）を実装し、DevTools オフラインモードで表示されることを確認する

## 7. レスポンシブデザイン・UI 仕上げ

- [x] 7.1 モバイル（320px）・タブレット（768px）・デスクトップ（1024px 以上）で各画面のレイアウトが崩れないことをブラウザの DevTools デバイスエミュレーターで確認する
- [x] 7.2 「ITK Apps」ブランドのヘッダー（サイトタイトル・検索バー統合・ダークモードトグルボタン）を実装し、ライト・ダーク両モードで全ページ共通表示されることを確認する
- [x] 7.3 ヘッダーのトグルボタンでライト/ダークが切り替わり、ページをリロードしても設定が保持されることを確認する。またシステム設定変更時にも初期値として反映されることを確認する
- [x] 7.4 フッターに「© ITK」コピーライト・GitHub リンク（`https://github.com/ITK13201`）・X リンク（`https://x.com/itk13201`）を実装し、全ページで表示されることを確認する
- [x] 7.5 OGP メタタグ（`og:title` / `og:description` / `og:image` / `twitter:card`）を `app/layout.tsx` に追加し、`og:image` は `public/og-image.png` プレースホルダーを参照することを確認する（本番画像は後で差し替え）
- [x] 7.6 `public/icons/` にアプリアイコン画像（PNG/WebP）を配置し、一覧・詳細ページで正しく表示されることを確認する

## 8. ビルド・デプロイ準備

- [x] 8.1 `pnpm build` が型エラー・ESLint エラーなしで完了し、`out/` ディレクトリに静的ファイルが生成されることを確認する
- [ ] 8.2 `pnpm build` で生成した `out/` ディレクトリを Cloudflare Pages ダッシュボードから手動アップロードし、`apps.i-tk.dev` でアプリが正常に動作することを確認する（カスタムドメインの DNS 設定は Cloudflare ダッシュボードで別途実施）
- [ ] 8.3 Lighthouse 監査（Performance / Accessibility / PWA）を実行し、PWA スコア 100 / Accessibility スコア 90 以上を達成していることを確認する
