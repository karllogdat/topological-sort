import click
import networkx as nx

from cli_dag.commands.file import read, write


def edge_from_input(g):
    edge = input('Edge format:\n\t[SOURCE]--[DESTINATION]\n> ')
    edge = edge.split('--')
    g.add_edge(edge[0], edge[1])


@click.command()
@click.option('--count', default=1, help="Number of edges to add")
@click.option('--file', prompt="File to process", help="File containing graph to add edge")
def add(file, count):
    g = read(file)
    for i in range(0, count):
        edge_from_input(g)
    write(g, file)
