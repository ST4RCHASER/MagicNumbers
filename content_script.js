document.addEventListener("dblclick", inject_box);
document.addEventListener("click", ClickEvent);
function ClickEvent() {
  if (document.getElementById("hbox_main") != null){
    fadeOut(document.getElementById("hbox_main"));
  }
    try{
      chrome.runtime.sendMessage({
        action: "createContext",
        value: getSelectionText()
    }, function(response) {
    });
    }catch(exc){}
}
function inject_box() {
  let text = getSelectionText();
  text = text.replace(" " , "");
  let result;
  let result_raw;
  if (!isNaN(text) && text.length > 1 && text.length < 8) {
    try{
      chrome.storage.sync.get(['h_backend', 'h_min', 'h_max', 'h_showcover', 'h_tags', 'h_popup'], function(items) {
        if (items.h_popup && Number(text) >= items.h_min && Number(text) <= items.h_max) {
          let backend = items.h_backend;
          var request = new XMLHttpRequest();
          var url = backend === 'nhentai' ? 'https://nhentai.net/api/gallery/' + text : 'https://h.api.rayriffy.com/v1/gallery/' + text;
          request.open("GET", url, true);
          request.onload = function() {
            if (backend == 'nhentai') {
              result = JSON.parse(this.response);
            }else {
              result = JSON.parse(this.response);
              result = result.response.data;
            }
            result_raw = this.response;
            if (request.status >= 200 && request.status < 400) {
              let selection = window.getSelection().getRangeAt(0);
              let rect = selection.getBoundingClientRect();
              let ex = document.createElement("div");
              if (result_raw.includes('media_id') === false) {
                ex.innerHTML = '<div class="hbox_title">No gallery found.</div>';
              } else {
                let tags_map = new Map();
                for (t in result.tags) {
                  if (tags_map.has(result.tags[t].type)) {
                    tags_map.set(
                      result.tags[t].type,
                      tags_map.get(result.tags[t].type) +
                      ", <font class=\"clicker\" onClick=\"window.open('https://nhentai.net/"+result.tags[t].type+"/"+replaceAll(result.tags[t].name," ", "-")+"', '_blank');\">" + capitalizeFLetter(result.tags[t].name) + "</font>"
                    );
                  } else {
                    tags_map.set(
                      result.tags[t].type,
                      "<font class=\"clicker\" onClick=\"window.open('https://nhentai.net/"+result.tags[t].type+"/"+replaceAll(result.tags[t].name," ", "-")+"', '_blank');\">" + capitalizeFLetter(result.tags[t].name) + "</font>"
                    );
                  }
                }
                let tags = "";
                for (let [key, value] of tags_map) {
                  tags += '<p class="hbox_tags"><b>' + capitalizeFLetter(key) + ":</b> " + capitalizeFLetter(value) + "</p>";
                }
                let image_src =
                  "https://t.nhentai.net/galleries/" +
                  result.media_id +
                  "/cover." +
                  (result.images.cover.t === "p" ? "png" : "jpg");
                ex.innerHTML = "<meta name='referrer' content='same-origin' />"+ (items.h_showcover ? '<a target="_blank" href="https://nhentai.net/g/'+ text +'"> <img class="hbox_book_cover" id="hbox_book_cover" onerror="this.onerror=null; document.getElementById(\'hbox_book_cover\').remove();" src="' +
                image_src +
                '"></img></a>' : '') +
                  '<a class="clicker" target="_blank" href="https://nhentai.net/g/'+ text +'"><div class="hbox_title">' +
                  result.title.japanese +
                  '</div> <div class="hbox_title">' +
                  result.title.english +
                  "</div></a> " + (items.h_tags ? tags + ' <div class="hbox_text_right hbox_tags">[' + (backend === 'nhentai' ? result.num_pages : result.images.pages.length) : '')  + ' Pages]</div>' ;
              }
              ex.setAttribute("id", "hbox_main");
              ex.setAttribute(
                "style",
                `top: ${rect.y + window.pageYOffset + 25}px; left: ${rect.x +
                  window.pageXOffset -
                  120}px;`
              );
              document.body.appendChild(ex);
              hide(ex);
              setTimeout(function(){ 
                fadeIn(ex);
              }, 50);
            } else {
              let selection = window.getSelection().getRangeAt(0);
              let rect = selection.getBoundingClientRect();
              let ex = document.createElement("div");
              ex.innerHTML = '<div class="hbox_title">No gallery found.</div>';
              ex.setAttribute("id", "hbox_main");
              ex.setAttribute(
                "style",
                `top: ${rect.y + window.pageYOffset + 25}px; left: ${rect.x +
                  window.pageXOffset -
                  120}px;`
              );
              document.body.appendChild(ex);
              hide(ex);
              setTimeout(function(){ 
                fadeIn(ex);
              }, 50);
            }
          };
          request.send();
        }
      });
    }catch(exr){}
  }
}
function getSelectionText() {
  var text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  return text;
}
function fadeIn(el){
  if (document.getElementById("hbox_main") != null){}
  el.classList.add('show');
  el.classList.remove('hide');  
  el.classList.remove('hide_fast');
}

function fadeOut(el){
  el.classList.add('hide');
  el.classList.remove('show');
  el.classList.remove('hide_fast');
   
	  setTimeout(function(){ 
 document.getElementById("hbox_main").remove();
  }, 300);
}
function hide(el){
  el.classList.remove('hide');
  el.classList.remove('show');
  el.classList.add('hide_fast');
}
function capitalizeFLetter(text) { 
   return text.replace(/^./, text[0].toUpperCase()); 
} 
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}