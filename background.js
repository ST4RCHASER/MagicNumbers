var contextItemMain = {
  id: "hmenu",
  title: "MagicNumber (%s)",
  contexts: ["selection"]
};
function openwithR(info) {
  var id = info.selectionText;
  chrome.tabs.create({ url: "https://h.rayriffy.com/g/" + id });
}
function openwithN(info) {
  var id = info.selectionText;
  chrome.tabs.create({ url: "https://nhentai.net/g/" + id });
}
var contextItemH = {
  id: "nmenu",
  title: "Open with nhentai",
  contexts: ["selection"],
  parentId: "hmenu"
};
var contextItemR = {
  id: "rmenu",
  title: "Open with Riffy H",
  contexts: ["selection"],
  parentId: "hmenu"
};
function createContextMenu() {
  chrome.contextMenus.create(contextItemMain);
  chrome.contextMenus.create(contextItemH);
  chrome.contextMenus.create(contextItemR);
}
chrome.contextMenus.onClicked.addListener(function(clickData) {
  if (clickData.selectionText) {
    if (clickData.menuItemId == "nmenu") {
      openwithN(clickData);
    }
    if (clickData.menuItemId == "rmenu") {
      openwithR(clickData);
    }
  }
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "createContext") {
    chrome.contextMenus.removeAll(function() {      

    var text = request.value;
    chrome.storage.sync.get(["h_menu", "h_min", "h_max"], function(items) {
      if (items.h_menu && !isNaN(text) && text.length > 1 && text.length < 8) {
        if (Number(text) >= items.h_min && Number(text) <= items.h_max) {
            createContextMenu();
        }
      }
    });
    sendResponse({ result: "ok" });
  })
  }
  
});

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install") {
    chrome.storage.sync.set(
      {
        h_backend: "hrayriffy",
        h_min: 10,
        h_max: 9999999,
        h_showcover: true,
        h_tags: true,
        h_menu: true,
        h_popup: true,
        h_bookmarks: '{"bookmarks":[{"id":69010,"title_en":"(C79) [Kamogawaya (Kamogawa Tanuki)] ViVitto (Mahou Shoujo Lyrical Nanoha)","title_jp":"(C79) [鴨川屋 (鴨川たぬき)] ViViっと (魔法少女リリカルなのは)","media_id":439523,"cover_type":"j", "date":1590149188},{"id":950,"title_en":"(CR36) [Art=Theater (Fred Kelly)] M.F.H.H. \'FP\' (Pretty Cure)","title_jp":"(CR36) [ART=THEATER (フレッド・ケリー)] M.F.H.H. \'FP\' (ふたりはプリキュア)","media_id":2681, "cover_type":"j", "date":1590149188}]}'
      },
      function() {
        chrome.tabs.create({ url: "options.html" });
        // chrome.tabs.create({
        //   url: "chrome://extensions/?options=" + chrome.runtime.id
        // });
      }
    );
  } else if (details.reason == "update") {
    var thisVersion = chrome.runtime.getManifest().version;
    console.log(
      "MagicNumbers Updated from " +
        details.previousVersion +
        " to " +
        thisVersion +
        "!"
    );
  }
});
chrome.browserAction.onClicked.addListener(function(tab) {
  
});
