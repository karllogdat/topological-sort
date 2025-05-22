import json
import networkx as nx
from pathlib import Path


def read(file):
    """Read graph from JSON file"""
    fpath = Path(file)
    if fpath.exists():
        if fpath.stat().st_size == 0:
            fpath.write_text("{\"nodes\":[],\"links\":[]}")
    else:
        fpath.write_text("{\"nodes\":[],\"links\":[]}")

    g = nx.DiGraph()
    with open(file, 'r') as file:
        graph = json.load(file)

    for edge in graph['links']:
        g.add_edge(edge['source'], edge['target'])

    return g


def write(g, file):
    """Save graph g to JSON file"""
    graph = {'nodes': [], 'links': []}

    for n in g:
        graph['nodes'].append(dict(id=n))
        for d in g[n]:
            graph['links'].append(dict(source=n, target=d))

    graph = json.dumps(graph, indent=4)

    with open(file, 'w') as f:
        f.write(graph)
