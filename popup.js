document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(['h_bookmarks'], function(items) {
        let bookmarks = JSON.parse(items.h_bookmarks).bookmarks;
        document.getElementById("option_btn").addEventListener("click", function () {
            chrome.tabs.create({ url: "options.html" });
        });
        let prepare_content = "";
        for (i in bookmarks) {
            let image_src = "https://t.nhentai.net/galleries/" + bookmarks[i].media_id + "/cover." + (bookmarks[i].cover_type === "p" ? "png" : "jpg");
            prepare_content += '<tr id="content_data_'+bookmarks[i].id+'" class="clicker">' +
                '  <td>' +
                '    <center>['+bookmarks[i].id+']</center><img class="cover" src="'+image_src+'">' +
                '  </td>' +
                '  <td>' +
                '    <img class="delete_btn" alt="Delete '+bookmarks[i].id+'" src="times.png">' +
                '    '+bookmarks[i].title_jp+' <br>' + bookmarks[i].title_en +
                '  </td>' +
                '</tr>'
        }
        document.getElementById("content").innerHTML = prepare_content;
        for (i in bookmarks) {
            document.getElementById("content_data_" + bookmarks[i].id).addEventListener("click", function () {
                window.open("https://nhentai.net/g/"+ bookmarks[i].id, "_blank");
            });
        }
    });
}, false);