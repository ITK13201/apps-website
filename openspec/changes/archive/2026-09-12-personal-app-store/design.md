## Context

新規プロジェクト。`/home/itk/Work/personal/projects/app` 配下に構築する。
動機は proposal.md の「Why」を参照。既存の gomi-no-hi PWA とは独立した別プロジェクトとして扱う。
アプリデータは静的ファイルで管理し、外部データベースや CMS は持たない。

**開発環境**: `nix develop` + pnpm（flake.nix で Node.js バージョンを固定）  
**フッター SNS**: GitHub `https://github.com/ITK13201` / X `https://x.com/itk13201`

## Goals / Non-Goals

**Goals:**
- Next.js（App Router）で静的生成（SSG）ベースの PWA を構築する
- アプリデータは `data/apps.json` で一元管理し、ビルド時に全ページを静的出力する
- Tailwind CSS でモバイルファースト・レスポンシブデザインを実現する
- Service Worker（next-pwa または Workbox）でオフラインキャッシュを構成する
- Cloudflare Pages（ダッシュボード手動アップロード）で静的ホスティングする（カスタムドメイン: `apps.i-tk.dev`）
- ライト・ダーク両モードに対応する（Tailwind CSS の `dark:` バリアント + `class` ストラテジー）
- フォントは Noto Sans JP（Google Fonts）を使用し、日本語・英語混在 UI に対応する

**Non-Goals:**
- 管理画面（Admin UI）の実装（アプリ追加は `data/apps.json` を直接編集）
- ユーザー認証・ログイン機能
- ランキング機能
- CMS・データベース連携
- アプリ内課金・決済処理

## Decisions

### 1. フレームワーク: Next.js（App Router）+ SSG
**決定**: `output: 'export'` による完全静的出力を採用する。  
**理由**: 動的サーバー不要でホスティングコストがゼロ。アプリデータは静的なので SSG で十分。  
**代替案**: SvelteKit・Astro も候補だが、Next.js は PWA エコシステムが成熟しており、他プロジェクトとの技術スタックの一貫性も高い。

### 2. アプリデータ管理: `data/apps.json`
**決定**: 単一の JSON ファイルでアプリデータを管理する。  
**スキーマ例**:
```json
[
  {
    "id": "gomi-no-hi",
    "name": "ゴミの日",
    "shortDescription": "越谷市のごみ収集日を確認・Push 通知する PWA",
    "description": "越谷市のごみ収集日を確認できる PWA アプリ。今日・明日・今後 7 日間の収集品目表示、月間カレンダー、分別ガイド、前日夜・当日朝の Push 通知、オフライン対応を備える。",
    "category": "Lifestyle",
    "icon": "/icons/gomi-no-hi.png",
    "screenshots": [],
    "githubUrl": "https://github.com/ITK13201/gomi-no-hi",
    "platforms": [
      { "type": "Mobile Web", "url": "https://gomi-no-hi.tail384c9.ts.net/" }
    ]
  },
  {
    "id": "money-rabbit",
    "name": "MoneyRabbit",
    "shortDescription": "CSV インポート × AI 自動分類の家計簿 PWA",
    "description": "銀行口座の CSV をインポートして収支を管理する個人用家計簿 PWA。キーワードルールと Claude API による AI 自動カテゴリ分類、月次サマリー・グラフ表示、CSV 2 ステップインポートを備える。",
    "category": "Finance",
    "icon": "/icons/money-rabbit.png",
    "screenshots": [],
    "githubUrl": "https://github.com/ITK13201/MoneyRabbit",
    "platforms": [
      { "type": "Mobile Web", "url": "https://moneyrabbit.tail384c9.ts.net/" }
    ]
  }
]
```
**UI レイアウト・言語**: カードはグリッド（モバイル 2 列 / タブレット 3 列 / デスクトップ 4 列）。ナビゲーションはヘッダーのみ（ボトムタブなし）。UI ラベルは英語（"Download" / "All" / "View Source" / "Search" など）、アプリの説明文は日本語。カテゴリ名は英語キーのまま表示（"Lifestyle" / "Finance"）。アプリ一覧は `data/apps.json` の記載順を維持する。詳細ページには "View Source" ボタン（`githubUrl` がある場合のみ）を置く。  
**理由**: CMS 不要でシンプル。Git で変更履歴が追える。個人プロジェクト規模では JSON で十分。  
**代替案**: MDX ファイルをアプリごとに持つ方法もあるが、一覧取得時のソートやフィルタリングが煩雑になる。

### 3. スタイリング: Tailwind CSS v4 + Noto Sans JP + next-themes
**決定**: Tailwind CSS v4 を採用し、フォントに Noto Sans JP（Google Fonts）を使う。v4 は `tailwind.config.ts` の代わりに CSS ファイル内の `@theme` ブロックでカスタムカラーを定義する（`--color-brand: #0071E3`）。ダークモードは `next-themes` ライブラリで管理し、Tailwind の `class` ストラテジーと組み合わせる。初期値はシステム設定に従い、ヘッダーの手動トグルボタンで切り替え可能にする。アクセントカラーは `#0071E3`（Apple blue）を Tailwind のカスタムカラーとして定義する。  
**理由**: `next-themes` は SSR/SSG 時のちらつき（FOUC）を防ぎ、localStorage にユーザーの好みを保存する。手動トグルとシステム連動の両立が最も少ない実装コストで実現できる。

### 4. PWA: @ducanh2912/next-pwa
**決定**: `@ducanh2912/next-pwa` で Service Worker を構成する。  
**理由**: オリジナル next-pwa のメンテ継続版で Next.js 15 / App Router との相性が良い。Workbox をラップしており信頼性が高い。

### 5. 検索: クライアントサイドフィルタリング
**決定**: アプリ一覧は起動時に全件メモリに読み込み、検索・カテゴリフィルタはクライアントで処理する。  
**理由**: アプリ数が数十件規模であれば Algolia 等の外部サービスは不要。追加サーバーコストもかからない。

## Risks / Trade-offs

- **アプリ数の増加** → フィルタリングが重くなる可能性。100 件程度なら問題なく、それ以上になったら仮想スクロールを検討する。
- **画像の最適化** → `output: 'export'` では `next/image` の最適化が使えないため、WebP への事前変換が必要。サイズ未最適化の画像をそのまま置くと LCP が悪化する。
- **PWA キャッシュの更新** → Service Worker のキャッシュ戦略次第でアプリデータの更新が反映されない場合がある。ビルド時にキャッシュバスティングを仕込む。

<!-- Open Questions: なし（全て解決済み）-->
