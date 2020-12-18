document.addEventListener("loaded", function (event) {
  // Select the node that will be observed for mutations
  const target_draft = document.querySelector("#playerPool");

  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback_draft = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        if(mutation.addedNodes[1]) {
          const added_node = mutation.addedNodes[1].querySelector("div.flex.style-scope.pugchamp-draft > a");
          const steamID64 = added_node.getAttribute("href").split("/player/")[1];
          
          createEloElement(added_node, steamID64);
        }
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer_draft = new MutationObserver(callback_draft);

  // Start observing the target node for configured mutations
  observer_draft.observe(target_draft, config);

  // initial page load
  const node_list_draft = document.querySelectorAll("div.flex.style-scope.pugchamp-draft > a");
  node_list_draft.forEach(node => {
    const steamID64 = node.getAttribute("href").split("/player/")[1];
    createEloElement(node, steamID64);
  });
});

async function createEloElement(node, steamID64) {
  const response = await fetch(`https://pugstats.herokuapp.com/api/players/${steamID64}`);
  const player = await response.json();

  const new_div = document.createElement("div");
  
  let elo = 1600;
  if (player) elo = player.elo;
  
  const new_content = document.createTextNode(Math.round(elo));
  const new_hue = Math.round(getHue(elo));

  new_div.style = `
      background-color: hsl(${new_hue}, 100%, 70%);
      text-decoration: none;
      color: white;
      display: inline;
      height: 16px;
      width: 44px;
      margin-right: 14px;
      padding: 0.15em 4px;
      font-size: 11px;
      font-weight: 400;
      line-height: 18px;
      text-align: center;
      border-radius: 2px;
      box-shadow: inset 0 -1px 0 rgba(30, 30, 30, 0.1);
      font-family: "Roboto", "Noto", sans-serif;
      position: relative;
    `;

  new_div.classList.add("pug-stats-elem")
  new_div.appendChild(new_content);
  node.parentNode.parentNode.insertBefore(new_div, node.parentNode.parentNode.firstChild);
}

function getHue(elo) {
  const old_min = 1400;
  const old_max = 1800;
  const new_min = 200;
  const new_max = 360;

  if(elo < old_min) return new_min;
  if(elo > old_max) return new_max;
  
  if(elo >= old_min && elo <= old_max) {
    const old_range = old_max - old_min;
    const new_range = new_max - new_min;
    const hue = (((elo - old_min) * new_range) / old_range) + new_min;

    return hue;
  }
}