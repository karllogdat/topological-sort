function create_graph(graph) {
    let d3graph = { nodes: [], links: [] }
    for (link in graph) {
        if (!d3graph.nodes.has(link.source)) {
            d3graph.nodes.push(link.source)
        }

        d3graph.links.push(link)
    }

    return d3graph
}

module.exports = { create_graph }