// 番號轉換成 FANZA 格式
// 例如: SSIS-123 → ssis00123, ADN-767 → adn00767
function toFanzaId(raw) {
  const text = raw.trim();
  const match = text.match(/^([a-zA-Z]+)-?(\d+)$/);
  if (!match) return null;
  const letters = match[1].toLowerCase();
  const numbers = match[2].padStart(5, "0");
  return letters + numbers;
}

// 建立右鍵選單
chrome.runtime.onInstalled.addListener(() => {
  // 父選單
  chrome.contextMenus.create({
    id: "quick-search-parent",
    title: "快速搜尋",
    contexts: ["selection"]
  });

  // 子選單：Shiroutowiki
  chrome.contextMenus.create({
    id: "search-shiroutowiki",
    parentId: "quick-search-parent",
    title: "Shiroutowiki",
    contexts: ["selection"]
  });

  // 子選單：Seesaawiki
  chrome.contextMenus.create({
    id: "search-seesaawiki",
    parentId: "quick-search-parent",
    title: "Seesaawiki",
    contexts: ["selection"]
  });

  // 子選單：Fanza
  chrome.contextMenus.create({
    id: "search-fanza",
    parentId: "quick-search-parent",
    title: "Fanza",
    contexts: ["selection"]
  });
});

// 點擊右鍵選單時執行
chrome.contextMenus.onClicked.addListener((info) => {
  const selected = info.selectionText.trim();
  let url = "";

  switch (info.menuItemId) {
    case "search-shiroutowiki":
      url = `https://shiroutowiki.work/?s=${encodeURIComponent(selected)}`;
      break;

    case "search-seesaawiki":
      url = `https://seesaawiki.jp/w/sougouwiki/search?search_type=2&search_target=all&keywords=${encodeURIComponent(selected)}`;
      break;

    case "search-fanza": {
      const fanzaId = toFanzaId(selected);
      if (fanzaId) {
        url = `https://video.dmm.co.jp/av/content/?id=${fanzaId}`;
      } else {
        url = `https://video.dmm.co.jp/av/list/?key=${encodeURIComponent(selected)}`;
      }
      break;
    }
  }

  if (url) {
    chrome.tabs.create({ url });
  }
});
