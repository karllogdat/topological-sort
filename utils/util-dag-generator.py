import json
import networkx as nx
import matplotlib.pyplot as plt


def print_graph(g):
    for n, edges in g.items():
        print(f"{n}: {edges}")


def insert_edge(g, src, dest):
    # ensure src and dest are valid nodes
    if src not in g:
        g[src] = []
    if dest not in g:
        g[dest] = []
    g[src].append(dest)


def get_edges(g):
    links = []
    for n, edges in g.items():
        for e in edges:
            links.append(dict(source=n, target=e))
    return links


def input_edge():
    edge = input("Format:\n\tsrc--dest\n")
    edge = edge.split("--")
    return edge


def main():
    graph = {}
    for i in range(0, 10):
        edge = input_edge()
        insert_edge(graph, edge[0], edge[1])
    dgraph = nx.DiGraph()
    for link in get_edges(graph):
        dgraph.add_edge(link['source'], link['target'])
    pos = nx.spring_layout(dgraph)
    nx.draw(dgraph, pos, with_labels=True, node_color='skyblue', arrows=True)
    plt.show()


if __name__ == "__main__":
    main()
