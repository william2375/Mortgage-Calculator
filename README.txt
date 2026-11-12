日式奶茶風房貸計算器｜完整修正版

檔案內容
- index.html：完整房貸計算器（保留原介面與三個分頁）
- service-worker.js：正式同源 Service Worker
- manifest.webmanifest：PWA 設定
- icon-192.png、icon-512.png：PWA 圖示
- apple-touch-icon.png：iPhone 主畫面圖示
- 測試報告.txt：公式核對與測試案例

部署方式
1. 將本資料夾內所有檔案放在網站根目錄，必須保留檔名與相對路徑。
2. 確認網站使用 HTTPS。
3. 使用 iPhone Safari 開啟網站，保持網路連線並等待頁面載入完成。
4. 重新整理一次，讓 Service Worker 控制頁面並快取 Tailwind CDN、Google Fonts 等外部資源。
5. iPhone Safari 點選「分享」→「加入主畫面」。

離線說明
- 房貸計算、分頁、還款明細及 localStorage 資料不需要伺服器。
- 首次至少需在線載入並重新整理一次，才能快取外部 CDN / 字型資源。
- 完成上述步驟後，再開啟飛航模式測試離線使用。
- 清除 Safari 網站資料會同時清除 localStorage 與快取。
- 使用 file:// 直接開啟 HTML 不支援 Service Worker；請部署至 HTTPS 網站。

計算假設
- 每期利息按當期期初剩餘本金 × 年利率 ÷ 12 計算，四捨五入至元。
- 每期先繳當期本息，再於期末執行該期額外還本。
- 降低月付：維持原定結清月份，重算剩餘攤還金額。
- 縮短年限：維持原月付金（本息平均）或原固定本金（本金平均），提前結清。
- 同一期多筆提前還款必須使用相同策略。
- 本工具為估算，不包含銀行手續費、違約金、帳務日計息、利率調整、寬限期契約差異等銀行個別條款。


主畫面圖示更新：已採用「房屋＋金幣」奶茶色手繪扁平風格。
圖示檔案包含 icon-192.png、icon-512.png、icon-1024.png 與 apple-touch-icon.png。
Service Worker 快取版本已更新為 v3；重新部署後，請在線開啟一次並重新整理，讓新圖示更新至裝置。
