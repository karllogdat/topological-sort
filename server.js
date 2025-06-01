// const { create_graph } = require('./utils/graph')

const express = require("express");
const { link } = require("fs");
const path = require("path");
const app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

// routes
const graphRoutes = require('./routes/graph');

app.use('/graph', graphRoutes);

app.get("/api/graph", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/data/graph.json"));
  console.log("Send graph data");
});

app.get("/api/graph/subgraph", (req, res) => {
  const target = req.query.target;
  const graph = require("./public/data/graph.json");
  let subgraph = [];

  // Build adjacency list (target -> [sources])
  let adj_list = new Map();
  graph.links.forEach((link) => {
    if (!adj_list.has(link.target)) {
      adj_list.set(link.target, []);
    }
    adj_list.get(link.target).push(link.source);
  });

  const visited = new Set(target);

  function dfs(node) {
    const deps = adj_list.get(node) || [];
    for (const dependency of deps) {
      if (!visited.has(dependency)) {
        visited.add(dependency);
        subgraph.push({ source: dependency, target: node });
        dfs(dependency);
      }
    }
  }

  dfs(target);

	graph.links.forEach((link) => {
		if (visited.has(link.target) && visited.has(link.source)) {
			subgraph.push(link)
		}
	});

  // Create graph data (D3 format)
  const create_graph = (edges) => {
    const nodes = new Set();
    edges.forEach((e) => {
      nodes.add(e.source);
      nodes.add(e.target);
    });

    return {
      nodes: Array.from(nodes).map((id) => ({ id })),
      links: edges,
    };
  };

	console.log(subgraph);

  return res.json(create_graph(subgraph));
});

app.listen(3000, () => {
  console.log('Server is running at port 3000');
});
