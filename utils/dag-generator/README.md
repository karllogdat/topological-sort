# CLI Directed Acyclic Graph Generator

A utility program for converting text files (.graph) files
into d3.js readable JSON format.

## Dependencies

Make sure you have `python` in your system, and install the
following libraries using `pip`:

```bash
pip install click networkx matplotlib
```

## Usage

> [!IMPORTANT]
> Make sure that your current working directory is
> in `utils/dag-generator`.

Before converting a file, ensure that the stored
edges is in the format of `source--destination`,
where `--` is the delimiter between the source and
destination node. For example:

```text
Algorithms--Asymptotic Analysis
Summations--Asymptotic Analysis
Asymptotic Analysis--Algorithmic Design
```

It is not necessary for the file to have a `.graph` file
extension, and it is only used for context.

To convert a file to JSON format use the command:

```bash
python -m cli_dag convert --file target.graph --output output.json
```

Where `target.graph` is the path to the file to
convert, and `output.json` is the path to the output
`.json` file.
