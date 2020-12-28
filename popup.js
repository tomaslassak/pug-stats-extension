document.addEventListener("DOMContentLoaded", function (event) {
  chrome.storage.local.get({ "space_for_div_helper": 50 }, function (data) {
    if (data.space_for_div_helper === 120) helper_space_toggler.checked = true;
    else helper_space_toggler.checked = false;
  });
});

const helper_space_toggler = document.querySelector("#helper-space-toggler");

helper_space_toggler.addEventListener("change", e => {
  if (e.target.checked) chrome.storage.local.set({ "space_for_div_helper": 120 });
  else chrome.storage.local.set({ "space_for_div_helper": 50 });
});