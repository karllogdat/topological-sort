export function draw_graph_arrowless(data) {
  const links = data.links.map((d) => ({ ...d }));
  const nodes = data.nodes.map((d) => ({ ...d }));

  const svg = d3.select("#graph");
  svg.selectAll("*").remove();

  // container for zooming
  const container = svg.append("g");
  // tooltip container for tooltip hover
  // tooltip div moves on node location when hovering
  const tooltip = d3.select("#tooltip");

  const width = +svg.attr("width");
  const height = +svg.attr("height");

  // Arrowhead svg for edges
  // -----------------------
  // svg
  //   .append("defs")
  //   .append("marker")
  //   .attr("id", "arrowhead")
  //   .attr("viewBox", "-0 -5 10 10")
  //   .attr("refX", 18) // adjust based on node radius
  //   .attr("refY", 0)
  //   .attr("orient", "auto")
  //   .attr("markerWidth", 5)
  //   .attr("markerHeight", 5)
  //   .attr("xoverflow", "visible")
  //   .append("svg:path")
  //   .attr("d", "M 0,-5 L 10 ,0 L 0,5")
  //   .attr("fill", "#999")
  //   .style("stroke", "none");

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(20)
    )
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = container
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "#999")
    .attr("stroke-width", 4)
    .attr("marker-end", "url(#arrowhead)");

  const node = container
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2.5)
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 9)
    .attr("fill", "steelblue")
    .call(drag(simulation))
    .on("mouseover", (event, d) => {
      tooltip.style("opacity", 1).html(d.id);
    })
    .on("mousemove", (event, d) => {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 20 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    })
    .on("dblclick", (_, d) => {
      const target = d.id;
      console.log(`Selected ${target}`);

      fetch(`/graph/subgraph?target=${encodeURIComponent(target)}`)
        .then((res) => res.json())
        .then((data) => {
          draw_graph_arrowless(data);
        })
        .catch((err) => {
          console.error(`Error fetching subgraph of target ${target}`);
        });

      fetch(`/graph/tsort?target=${encodeURIComponent(target)}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          const tlist = document.getElementById("tlist");
          tlist.replaceChildren();

          data.forEach((item) => {
            console.log(`Creating <p> for item ${item}`);
            const item_html = document.createElement("li");
            item_html.textContent = item;
            tlist.appendChild(item_html);
          });
        })
        .catch((err) => {
          console.error(
            `Error fetching tsort of target ${target}.\nError: ${err}`
          );
        });

      tooltip.style("opacity", 0);
    });

  // add labels static
  // const label = container
  //   .append("g")
  //   .selectAll("text")
  //   .data(nodes)
  //   .enter()
  //   .append("text")
  //   .attr("dy", -15)
  //   .attr("dx", -10)
  //   .text((d) => d.id)
  //   .style("fill", "#777");

  function forceCircular(radius, centerX, centerY) {
    function force(alpha) {
      for (const node of nodes) {
        const dx = node.x - centerX;
        const dy = node.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > radius) {
          const angle = Math.atan2(dy, dx);
          const targetX = centerX + radius * Math.cos(angle);
          const targetY = centerY + radius * Math.sin(angle);

          node.vx += (targetX - node.x) * 0.1 * alpha;
          node.vy += (targetY - node.y) * 0.1 * alpha;
        }
      }
    }

    let nodes;
    force.initialize = (_nodes) => (nodes = _nodes);
    return force;
  }

  simulation.force("circular_bound", forceCircular(100, width / 2, height / 2));

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    // for static labels
    // label.attr("x", (d) => d.x).attr("y", (d) => d.y);
  });

  svg.call(
    d3
      .zoom()
      .scaleExtent([0.1, 4]) // min and max zoom levels
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      })
  );
}

function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

export function to_mermaid(graph) {
  let mermaid = "flowchart TD\n";
  let nodes = [];

  graph.links.forEach((link) => {
    let source = link.source.replace("[", "").replace("]", "");
    let target = link.target.replace("[", "").replace("]", "");

    if (nodes.indexOf(source) === -1) {
      nodes.push(source);
    }
    if (nodes.indexOf(target) === -1) {
      nodes.push(target);
    }
  });

  graph.links.forEach((link, i) => {
    let source = link.source.replace("[", "").replace("]", "");
    let target = link.target.replace("[", "").replace("]", "");

    mermaid += `\t${nodes.indexOf(source)}["${source}"]-->${nodes.indexOf(
      target
    )}["${target}"]\n`;
  });

  return mermaid;
}
