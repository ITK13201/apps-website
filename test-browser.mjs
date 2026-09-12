import { chromium } from "playwright";

const BASE_URL = "http://localhost:3000";

let passed = 0;
let failed = 0;

function ok(label) {
  console.log(`  ✓ ${label}`);
  passed++;
}
function fail(label, err) {
  console.log(`  ✗ ${label}: ${err}`);
  failed++;
}
function section(title) {
  console.log(`\n## ${title}`);
}

const browser = await chromium.launch({
  headless: true,
  executablePath: "/run/current-system/sw/bin/google-chrome-stable",
});
const page = await browser.newPage();

// ─── 1. ホームページ ────────────────────────────────────────────────
section("1. ホームページ");
await page.goto(BASE_URL);
await page.waitForLoadState("networkidle");

const title = await page.title();
title === "ITK Apps" ? ok("タイトルが ITK Apps") : fail("タイトル", title);

const header = await page.locator("header").textContent();
header.includes("ITK Apps") ? ok("ヘッダーにサイト名") : fail("ヘッダー", header);

const cards = await page.locator("a[href^='/apps/']").count();
cards >= 2 ? ok(`アプリカード ${cards} 件表示`) : fail("アプリカード数", cards);

const searchInput = await page.locator('input[type="search"]').count();
searchInput >= 1 ? ok("検索フィールドが存在") : fail("検索フィールド", "not found");

const categoryAll = await page.locator("button", { hasText: "All" }).count();
categoryAll >= 1 ? ok("カテゴリ All ボタンが存在") : fail("All ボタン", "not found");

// グリッドレイアウトの確認（grid-cols-2 クラス）
const grid = await page.locator(".grid-cols-2").count();
grid >= 1 ? ok("グリッドレイアウトが存在") : fail("グリッドレイアウト", "not found");

// ─── 2. プラットフォームバッジ ──────────────────────────────────────
section("2. プラットフォームバッジ");
const mobileBadge = await page.locator("text=Mobile Web").count();
mobileBadge >= 1 ? ok("Mobile Web バッジが表示") : fail("Mobile Web バッジ", "not found");

// ─── 3. カテゴリフィルター ─────────────────────────────────────────
section("3. カテゴリフィルター");
const lifestyleBtn = await page.locator("button", { hasText: "Lifestyle" });
await lifestyleBtn.click();
await page.waitForTimeout(300);

const visibleCards = await page.locator("a[href^='/apps/']").count();
visibleCards < cards
  ? ok(`Lifestyle フィルター: ${visibleCards} 件に絞り込み`)
  : fail("フィルター絞り込み", `${visibleCards} 件（変化なし）`);

const allBtn = await page.locator("button", { hasText: "All" });
await allBtn.click();
await page.waitForTimeout(300);
const allCards = await page.locator("a[href^='/apps/']").count();
allCards === cards ? ok("All 選択で全件に戻る") : fail("All 選択", `${allCards} 件`);

// ─── 4. 検索機能 ────────────────────────────────────────────────────
section("4. 検索機能");
const searchBox = await page.locator('input[type="search"]').first();
await searchBox.fill("gomi");
await page.waitForTimeout(300);

const searchResults = await page.locator("a[href^='/apps/']").count();
searchResults < cards
  ? ok(`"gomi" 検索: ${searchResults} 件にフィルタリング`)
  : fail("検索フィルタリング", `${searchResults} 件（変化なし）`);

// 大文字小文字テスト
await searchBox.fill("GOMI");
await page.waitForTimeout(300);
const upperResults = await page.locator("a[href^='/apps/']").count();
upperResults === searchResults ? ok("大文字小文字を区別しない") : fail("大文字小文字", `${upperResults} 件`);

// 一致なし
await searchBox.fill("xyznonexistent");
await page.waitForTimeout(300);
const noResult = await page.locator("text=No apps found").count();
noResult >= 1 ? ok("一致なし時に空状態メッセージ表示") : fail("空状態メッセージ", "not found");

// 検索クリア
await searchBox.fill("");
await page.waitForTimeout(300);
const clearedCards = await page.locator("a[href^='/apps/']").count();
clearedCards === cards ? ok("検索クリアで全件表示") : fail("検索クリア", `${clearedCards} 件`);

// ─── 5. 検索 × カテゴリ AND 条件 ────────────────────────────────────
section("5. 検索 × カテゴリ AND 条件");
await page.locator("button", { hasText: "Finance" }).click();
await searchBox.fill("rabbit");
await page.waitForTimeout(300);
const andResults = await page.locator("a[href^='/apps/']").count();
andResults >= 1
  ? ok(`Finance × "rabbit": ${andResults} 件`)
  : fail("AND 条件フィルター", "0 件");
// Finance かつ全件一致しない
await searchBox.fill("gomi");
await page.waitForTimeout(300);
const andEmpty = await page.locator("a[href^='/apps/']").count();
andEmpty === 0 ? ok("Finance × 'gomi': 0 件（正しく除外）") : fail("AND 条件除外", `${andEmpty} 件`);
await page.locator("button", { hasText: "All" }).click();
await searchBox.fill("");

// ─── 6. アプリ詳細ページ ─────────────────────────────────────────
section("6. アプリ詳細ページ");
await page.locator("a[href^='/apps/gomi-no-hi']").first().click();
await page.waitForLoadState("networkidle");

const detailTitle = await page.locator("h1").textContent();
detailTitle?.includes("ゴミの日")
  ? ok(`詳細ページタイトル: ${detailTitle.trim()}`)
  : fail("詳細タイトル", detailTitle ?? "none");

const downloadBtn = await page.locator("a[target='_blank']").count();
downloadBtn >= 1 ? ok(`外部リンクが ${downloadBtn} 件存在`) : fail("外部リンク", "none");

const viewSourceBtn = await page.locator("text=View Source").count();
viewSourceBtn >= 1 ? ok("View Source ボタンが存在") : fail("View Source", "not found");

const backBtn = await page.locator("text=Back").count();
backBtn >= 1 ? ok("Back リンクが存在") : fail("Back", "not found");

// 戻る動作
await page.locator("a", { hasText: "Back" }).click();
await page.waitForURL(/localhost:3000\/?$/, { timeout: 5000 }).catch(() => {});
const backUrl = page.url();
backUrl.replace(/\/$/, "") === BASE_URL
  ? ok("Back でトップページに戻る")
  : fail("Back 遷移", backUrl);

// ─── 7. 存在しない ID で 404 ────────────────────────────────────────
// output: 'export' では generateStaticParams() にないパラメータは
// dev サーバーでエラーになる。本番では Cloudflare が 404.html を返す。
// ここでは静的ビルド出力で 404.html の存在と内容を確認する。
section("7. 404 ページ (静的ビルド確認)");
import { existsSync, readFileSync } from "fs";
const outDir = "/home/itk/Work/personal/projects/app/out";
existsSync(`${outDir}/404.html`)
  ? ok("out/404.html が存在")
  : fail("out/404.html", "not found");
!existsSync(`${outDir}/apps/nonexistent-app/index.html`)
  ? ok("存在しない ID のページが静的生成されていない（404 になる）")
  : fail("静的生成の排他性", "nonexistent-app が生成されてしまっている");
// not-found.tsx が組み込まれているか確認（ビルドの 404 ページ内容チェック）
const notFoundHtml = readFileSync(`${outDir}/404/index.html`, "utf8");
notFoundHtml.includes("Page not found") || notFoundHtml.includes("404")
  ? ok("404 ページに適切なメッセージが含まれる")
  : fail("404 ページ内容", notFoundHtml.slice(0, 60));

// ─── 8. OGP・マニフェスト確認 ───────────────────────────────────────
section("8. OGP / PWA メタタグ");
await page.goto(BASE_URL);
const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
ogTitle === "ITK Apps" ? ok("og:title = ITK Apps") : fail("og:title", ogTitle ?? "none");

const manifest = await page.locator('link[rel="manifest"]').getAttribute("href");
manifest === "/manifest.json" ? ok("manifest リンクが存在") : fail("manifest", manifest ?? "none");

const themeColor = await page.locator('meta[name="theme-color"]').getAttribute("content");
themeColor === "#0071E3" ? ok(`theme-color = ${themeColor}`) : fail("theme-color", themeColor ?? "none");

// ─── 9. フッター ──────────────────────────────────────────────────
section("9. フッター");
const footerGitHub = await page.locator('footer a[href="https://github.com/ITK13201"]').count();
footerGitHub >= 1 ? ok("GitHub リンクが存在") : fail("GitHub リンク", "not found");
const footerX = await page.locator('footer a[href="https://x.com/itk13201"]').count();
footerX >= 1 ? ok("X リンクが存在") : fail("X リンク", "not found");
const copyright = await page.locator("footer").textContent();
copyright?.includes("ITK") ? ok("© ITK コピーライト") : fail("コピーライト", copyright ?? "none");

// ─── 10. ダークモードトグル ──────────────────────────────────────────
section("10. ダークモード");
const toggleBtn = await page.locator('button[aria-label="Toggle dark mode"]');
const count = await toggleBtn.count();
count >= 1 ? ok("ダークモードトグルボタンが存在") : fail("トグルボタン", "not found");
if (count >= 1) {
  await toggleBtn.click();
  await page.waitForTimeout(500);
  const htmlClass = await page.locator("html").getAttribute("class");
  htmlClass?.includes("dark") || htmlClass?.includes("light")
    ? ok(`テーマ切り替え後: class="${htmlClass}"`)
    : fail("テーマ切り替え", htmlClass ?? "none");
}

await browser.close();

// ─── 結果サマリー ───────────────────────────────────────────────────
console.log(`\n${"=".repeat(50)}`);
console.log(`結果: ${passed} 件成功 / ${failed} 件失敗`);
if (failed === 0) {
  console.log("✅ 全テスト通過！");
} else {
  console.log("❌ 一部テストが失敗しました");
  process.exit(1);
}
