export function as_adj_list(graph) {
  let adj_list = new Map();

  graph.forEach(({ source, target }) => {
    if (!adj_list.has(source)) {
      adj_list.set(source, []);
    }
    if (!adj_list.has(target)) {
      adj_list.set(target, []);
    }
    adj_list.get(source).push(target);
  });

  return adj_list;
}

export function subgraph(graph, target) {
  let subgraph = [];

  // build reverse adjacency list from graph edge list
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
    if (!visited.has(node)) {
      visited.add(node);
    }

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

  return subgraph;
}
