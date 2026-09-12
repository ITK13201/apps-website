## Why

自分がリリースしたアプリを一元管理・公開できる場所がなく、ユーザーが各アプリを探しにくい状態にある。App Store 風の PWA（モバイル・デスクトップ両対応）を用意することで、iOS / Android / Windows / macOS / Web など複数プラットフォーム向けアプリを 1 か所で紹介・ダウンロードへ誘導できるようにする。

## What Changes

- 新規 PWA アプリケーションとして "ITK Apps" を立ち上げる
- アプリ情報を静的データ（JSON / Markdown）で管理し、ビルド時に生成する
- カテゴリ別アプリ一覧・アプリ詳細・キーワード検索の 3 画面を実装する
- PWA マニフェスト・Service Worker を組み込み、オフライン閲覧とホーム画面追加に対応する
- レスポンシブレイアウトでモバイル・デスクトップ両対応とする

## Capabilities

### New Capabilities

- `app-catalog`: カテゴリ別アプリ一覧の表示。フィルタリング・ソートに対応する
- `app-detail`: 個別アプリの詳細ページ。説明・スクリーンショット・プラットフォーム別ダウンロードリンクを提供する
- `app-search`: アプリ名・説明文によるキーワード検索機能
- `pwa-core`: PWA マニフェスト・Service Worker による installability とオフライン対応

### Modified Capabilities

（既存の仕様変更なし）

## Impact

- 新規プロジェクトとして `/home/itk/Work/personal/projects/app` 配下に実装する
- 依存: Next.js（App Router）、Tailwind CSS、next-pwa または Workbox
- アプリデータは `data/apps.json`（または MDX）で管理し、CMS・DB は不要
- 既存の gomi-no-hi PWA とは独立した別プロジェクト
