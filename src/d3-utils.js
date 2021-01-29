import * as d3 from "d3";
import * as data from "./data.json";

var i = 0,
  duration = 750;

var margin = { top: 20, right: 20, bottom: 20, left: 20 },
  width = 960 - margin.right - margin.left,
  height = 700 - margin.top - margin.bottom;

var svgCanvas, tree;

export var root;

export const initTree = (refCanvas) => {
  svgCanvas = d3
    .select(refCanvas)
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "graph-svg-component")
    .style("border", "1px solid black")
    .append("g")
    .attr("transform", "translate(" + 150 + "," + (margin.top + 20) + ")");

  // construc root node
  root = d3.hierarchy(data);

  // construct the tree
  tree = d3.tree().size([height, width]);

  tree(root);
};

export const click = (event, d) => {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }

  update(d);
};

export const collapse = (d) => {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
};

export const update = (source) => {
  // Compute the new tree layout.
  let nodes = source.descendants(),
    links = source.links();

  var diagonal = function linkF(d) {
    return (
      "M" +
      d.source.x +
      "," +
      d.source.y +
      "C" +
      d.source.x +
      "," +
      (d.source.y + d.target.y) / 2 +
      " " +
      d.target.x +
      "," +
      (d.source.y + d.target.y) / 2 +
      " " +
      d.target.x +
      "," +
      d.target.y
    );
  };

  // Normalize for fixed-depth.
  nodes.forEach(function (d) {
    d.y = d.depth * 180;
  });

  // Declare the nodes…
  var node = svgCanvas.selectAll("g.node").data(nodes, function (d) {
    return d.id || (d.id = ++i);
  });

  // Enter the nodes.
  var nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .on("mouseover", function (event, n) {
      var indexFilteredNode = [];

      nodes.forEach((nd, index) => {
        if (n.ancestors().indexOf(nd) > -1) {
          indexFilteredNode.push(index);
        }
      });

      var filteredNode = nodeEnter.filter(
        (nd, index) => indexFilteredNode.indexOf(index) > -1
      );
      filteredNode.selectAll("circle").style("fill", "red");
    })
    .on("mouseout", function (event, n) {
      var indexFilteredNode = [];

      nodes.forEach((nd, index) => {
        if (n.ancestors().indexOf(nd) > -1) {
          indexFilteredNode.push(index);
        }
      });

      var filteredNode = nodeEnter.filter(
        (nd, index) => indexFilteredNode.indexOf(index) > -1
      );
      filteredNode.selectAll("circle").style("fill", "white");
    })
    .on("click", click);

  // Remove any exiting nodes
  var nodeExit = node
    .exit()
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();
  // On exit reduce the node circles size to 0
  nodeExit.select("circle").attr("r", 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select("text").style("fill-opacity", 1e-6);

  nodeEnter.append("circle").attr("r", 10).style("fill", "#fff");

  nodeEnter
    .append("text")
    .attr("x", function (d) {
      return d.children || d._children ? -13 : 13;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", function (d) {
      return d.children || d._children ? "end" : "start";
    })
    .text(function (d) {
      return d.data.name;
    })
    .style("fill-opacity", 1);

  // Declare the links…
  var link = svgCanvas.selectAll("path.link").data(links, function (d) {
    return d.target.id;
  });

  // Enter the links.
  link
    .enter()
    .insert("path", "g")
    .attr("class", "link")
    .attr("stroke", "white")
    .attr("d", function (d) {
      var source = { x: d.source.x, y: d.source.y };
      var target = { x: d.target.x, y: d.target.y };
      return diagonal({ source: source, target: target });
    });
};

export const removeSVGContent = () => {
  svgCanvas.selectAll("*").remove();
};
