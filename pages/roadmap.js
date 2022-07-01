function drawGraph(container){
    colorScale = d3
    .scaleOrdinal()
    .domain(sankeyData.nodes.map((n) => n.name))
    .range([
      "#92C24D",  //green
      "#E86464",  //red
      "#928787"   //grey
    ])
  
    dimensions = Object({
        height: 500,
        width: 1000,
        margins: 10,
    })

    data = d3.tsvParse(
        `source\ttarget\tvalue
      "2D Vector"\t"2D Force"\t2
      "2D Force"\t"Moment"\t2
      "2D Force"\t"Sum of Forces"\t2
      "2D Force"\t"Free Body Diagram"\t2
      "Cross Product"\t"Moment"\t2
      "Moment"\t"Couple"\t2
      "Moment"\t"Free Body Diagram"\t2
      "Moment"\t"2D Equilibrium"\t2
      "Sum of Forces"\t"Resultant"\t2
      "Sum of Forces"\t"2D Equilibrium"\t2
      "Couple"\t"Resultant"\t2
      "Free Body Diagram"\t"2D Equilibrium"\t2
      "2D Equilibrium"\t"2D Trusses"\t2
      "2D Equilibrium"\t"2D Frame Machines?"\t2
      "2D Equilibrium"\t"Distributed Loads"\t2
      "2D Equilibrium"\t"Friction"\t2
      "Center of Mass, Simple Bodies"\t"Center of Mass, Composite"\t2
      "Center of Mass, Composite"\t"Distributed Loads"\t2
      "Distributed Loads"\t"Flexible Cable"\t2
      "Distributed Loads"\t"Fluid Statics"\t2
      "Distributed Loads"\t"Shear Forces & Bending Moments"\t2
      `,
        d3.autoType
      )

    sankeyData = processNodes();

    const svg = d3
        .select(container).append("svg")
        .attr("height", dimensions.height)
        .attr("width", dimensions.width)
        .attr("overflow", "visible");
    
    const chart = svg
        .append("g")
        .attr("transform", `translate(${dimensions.margins},${dimensions.margins})`)
        .attr("height", dimensions.height - dimensions.margins * 2)
        .attr("width", dimensions.width - dimensions.margins * 2)
        .attr("overflow", "visible");
    
    const adjustor = (i) => {
        if (i === 8) {
        return 30;
        } else if (i === 6) {
        return -30;
        } else return 0;
    };
    
    const nodes = chart
        .append("g")
        .selectAll("rect")
        .data(sankeyData.nodes)
        .join("rect")
        .attr("x", (d) => d.x0)
        .attr("y", (d) => d.y0)
        .attr("fill", (d) => colorScale(d.name))
        .attr("height", (d) => d.y1 - d.y0)
        .attr("width", (d) => d.x1 - d.x0);
    
    const links = chart
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.1)
        .selectAll("path")
        .data(sankeyData.links)
        .join("path")
        .attr("d", d3Sankey.sankeyLinkHorizontal())
        .attr("stroke-width", function (d) {
            return d.width;
        })
        .on('mouseover', function (d) {
            d3.select(this).style("stroke-opacity", "0.5")
            d3.select(this).style("stroke", "#7fd7f5")
        })
        .on('mouseout', function (d) {
            d3.select(this).style("stroke-opacity", ".1")
            d3.select(this).style("stroke", "#000")
        });
    
    const labelNames = chart
        .append("g")
        .selectAll("text")
        .data(sankeyData.nodes)
        .join("text")
        .text((d) => d.name)
        .attr("class", (d) => d.depth)
        .attr("x", (d) => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.25em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .attr("font-size", "10")

    return svg.node();
    }

function processNodes() {
    const sankeyData = { nodes: [], links: [] };
    //sankey Arguments
    data.forEach((d) => {
    const nodesList = sankeyData.nodes.map((n) => n.name);
    if (!nodesList.includes(d.source)) {
        sankeyData.nodes.push({ name: d.source });
    }
    if (!nodesList.includes(d.target)) {
        sankeyData.nodes.push({ name: d.target });
    }
    sankeyData.links.push({
        source: d.source,
        target: d.target,
        value: d.value
    });
    });
    sankeyData.links.forEach((l, lNdx) => {
    sankeyData.links[lNdx].source = sankeyData.nodes.indexOf(
        sankeyData.nodes.find((n) => n.name === l.source)
    );
    sankeyData.links[lNdx].target = sankeyData.nodes.indexOf(
        sankeyData.nodes.find((n) => n.name === l.target)
    );
    });
    
    const sankeyViz = d3Sankey
    .sankey()
    .nodes(sankeyData.nodes)
    .links(sankeyData.links)
    .nodeAlign(d3Sankey.sankeyLeft)
    .nodeWidth(25)
    .nodePadding(80)
    .extent([
    [dimensions.margins, dimensions.margins],
    [
        dimensions.width - dimensions.margins * 2,
        dimensions.height - dimensions.margins * 2
    ]
    ]);
    return sankeyViz();
}