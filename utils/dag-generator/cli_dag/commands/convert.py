import click
import networkx as nx
from cli_dag.commands.file import list_lines, write


@click.command()
@click.option('--file', prompt='Path of file to process', help='.graph file to convert into JSON form')
@click.option('--output', prompt='Output JSON file path', help='JSON file to dump graph info (removes existing data)')
def convert(file, output):
    '''Converts a given .graph file to a JSON file readable by d3.js.'''
    g = nx.DiGraph()
    lines = list_lines(file)
    for line in lines:
        edge = line.split('--')
        g.add_edge(edge[0], edge[1])

    write(g, output)
    