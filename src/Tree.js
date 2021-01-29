import React from "react";
import * as d3 from "d3";
// import * as data from "./data.json";
import "./Tree.css";

import { update, initTree, root } from "./d3-utils";

export default class Tree extends React.Component {
  constructor(props) {
    super(props);

    this.svgCanvas = null;
    this.tree = null;
    this.root = null;
    this.state = {};
  }

  componentDidMount() {
    if (this.tree == null) {
      initTree(this.refs.canvas);
    }

    update(root);
  }

  render() {
    return <div id="canvas" ref="canvas"></div>;
  }
}
