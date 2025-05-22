import click
from cli_dag.commands import show, add, convert


@click.group()
def cli_dag():
    """CLI tool for generating DAGs and exporting
    into JSON format usable for d3.js"""
    pass


cli_dag.add_command(show.show)
cli_dag.add_command(add.add)
cli_dag.add_command(convert.convert)


if __name__ == '__main__':
    cli_dag()
