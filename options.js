var manifestData = chrome.runtime.getManifest();
document.getElementById("title").innerHTML = "MagicNumbers v" + manifestData.version + " Options";
function save_options() {
  var backend_ = document.getElementById("backend").value;
  var min_ = document.getElementById("min").value;
  var max_ = document.getElementById("max").value;
  var showcover_ = document.getElementById("cover_show").checked;
  var tags_ = document.getElementById("tags_show").checked;
  var popup_ = document.getElementById("popup").checked;
  var menu_ = document.getElementById("menu").checked;
  chrome.storage.sync.set(
    {
      h_backend: backend_,
      h_min: min_,
      h_max: max_,
      h_showcover: showcover_,
      h_tags: tags_,
      h_menu: menu_,
      h_popup: popup_
    },
    function() {
      window.close()
      var status = document.getElementById("status");
      status.innerHTML = "<br>Options saved.";
      setTimeout(function() {
        status.innerHTML = "";
      }, 3000);
    }
  );
}
function restore_options() {
  chrome.storage.sync.get(
    {
      h_backend: "nhentai",
      h_min: 10,
      h_max: 9999999,
      h_showcover: true,
      h_tags: true,
      h_menu: true,
      h_popup: true
    },
    function(items) {
      document.getElementById("backend").value = items.h_backend;
      document.getElementById("min").value = items.h_min;
      document.getElementById("max").value = items.h_max;
      document.getElementById("cover_show").checked = items.h_showcover;
      document.getElementById("tags_show").checked = items.h_tags;
      document.getElementById("menu").checked = items.h_menu;
      document.getElementById("popup").checked = items.h_popup;
    }
  );
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
