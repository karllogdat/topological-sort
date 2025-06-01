const path = require('path');

const express = require('express');
const router = express.Router();

// returns graph with all nodes
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/data/graph.json'));
});

// returns all the dependencies (and their dependencies) 
// of target topic
router.get('/subgraph', (req, res) => {
    const target = req.query.target;
    const graph = require('../public/data/graph.json');

    let subgraph = [];

    // build adjacency list from graph edge list
    let adj_list = new Map();
    graph.links.forEach((link) => {
        if (!adj_list.has(link.target)) {
            adj_list.set(link.target, []);
        }
        adj_list.get(link.target).push(link.source);
    });

    const visited = new Set(target);
    // do a dfs to get nodes in subgraph
    function dfs(node) {
        const deps = adj_list.get(node) || [];
        for (const dependency of deps) {
            if (!visited.has(dependency)) {
                visited.add(dependency);
                dfs(dependency);
            }
        }
    }
    dfs(target);

    // get all edges in main graph that 
    // are in the subgraph 
    graph.links.forEach((link) => {
        if (visited.has(link.source) && visited.has(link.target)) {
            subgraph.push(link);
        }
    });

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

    return res.json(to_d3js_graph(subgraph));
});

module.exports = router;