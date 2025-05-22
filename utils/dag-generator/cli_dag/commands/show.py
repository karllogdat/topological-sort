import click
import matplotlib.pyplot as plt
import networkx as nx

from cli_dag.commands.file import read


@click.command()
@click.option("--file", prompt="File to process", help="File of graph to display")
def show(file):
    graph = read(file)
    pos = nx.spring_layout(graph)
    nx.draw(graph, pos, with_labels=True, node_color='skyblue', arrows=True)
    plt.show()
