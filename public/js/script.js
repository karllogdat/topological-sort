import { draw_graph_arrowless } from "./graph_renderers.js";

// renders full graph on page load
fetch("/graph")
  .then((res) => res.json())
  .then((data) => {
    console.log("Graph data: ", data);
    draw_graph_arrowless(data);
  });

// adds an event listener to the submit button
// to render based on topic
document.getElementById("search").addEventListener("click", () => {
  const target = document.getElementById("target").value;

  if (!target) {
    fetch("/graph")
      .then((res) => res.json())
      .then((data) => {
        console.log("Graph data: ", data);
        draw_graph_arrowless(data);
      });

    return;
  }

  fetch(`/graph/subgraph?target=${encodeURIComponent(target)}`)
    .then((res) => res.json())
    .then((data) => {
      draw_graph_arrowless(data);
    })
    .catch((err) => {
      console.error(`Error fetching subgraph of target ${target}`);
    });

  fetch(`/graph/tsort?target=${encodeURIComponent(target)}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      const tlist = document.getElementById("tlist");
      tlist.replaceChildren();

      data.forEach((item) => {
        console.log(`Creating <p> for item ${item}`);
        const item_html = document.createElement("li");
        item_html.textContent = item;
        tlist.appendChild(item_html);
      });
    })
    .catch((err) => {
      console.error(`Error fetching tsort of target ${target}.\nError: ${err}`);
    });
});
