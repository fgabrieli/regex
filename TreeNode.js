function TreeNode(type, data) {
    this.type = type ? type : '';

    this.data = data ? data : {};

    // i leave this exposed for debugging purposes
    this.nodes = [];

    /**
     * Print tree for the parsed regex.
     */
    this.print = function() {
        console.log(this);

        for (var i = 0; i < this.nodes.length; i++) {
            this.print.call(this.nodes[i]);
        }
    }
}

module.exports = {
    TreeNode : TreeNode
}