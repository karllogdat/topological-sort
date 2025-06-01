const path = require("path");

const express = require("express");
const router = express.Router();

const { subgraph, as_adj_list } = require("./utils/graph");

// returns graph with all nodes
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/data/graph.json"));
});

// returns all the dependencies (and their dependencies)
// of target topic
router.get("/subgraph", (req, res) => {
  const target = req.query.target;
  const graph = require("../public/data/graph.json");

  const deps = subgraph(graph, target);

  // convert to d3js format
  const to_d3js_graph = (edges) => {
    const nodes = new Set();
    edges.forEach((edge) => {
      nodes.add(edge.source);
      nodes.add(edge.target);
    });

    return {
      nodes: Array.from(nodes).map((id) => ({ id })),
      links: edges,
    };
  };

  return res.json(to_d3js_graph(deps));
});

router.get("/tsort", (req, res) => {
  const target = req.query.target;
  const graph = require("../public/data/graph.json");
  const deps = as_adj_list(subgraph(graph, target));

  const in_degree = new Map();
  const order = [];
  const queue = [];

  // initialize in-degree of all nodes to 0
  deps.forEach((_, node) => {
    in_degree.set(node, 0);
  });
  // count actual in-degrees
  deps.forEach((neighbors) => {
    neighbors.forEach((neighbor) => {
      in_degree.set(neighbor, (in_degree.get(neighbor) || 0) + 1);
    });
  });

  // enqueue all nodes with 0 in-degree
  in_degree.forEach((deg, node) => {
    if (deg === 0) {
      queue.push(node);
    }
  });

  // Kahn's Algorithm
  while (queue.length > 0) {
    const current = queue.shift();
    order.push(current);

    if (deps.has(current)) {
      deps.get(current).forEach((neighbor) => {
        in_degree.set(neighbor, in_degree.get(neighbor) - 1);
        if (in_degree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      });
    }
  }

  // check for cycles
  if (order.length !== deps.size) {
    console.log("Graph contains cycle, no topological order.");
    return res.status(400).json({ error: "Graph contains a cycle" });
  }

  return res.json(order);
});

module.exports = router;
