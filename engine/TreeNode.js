/**
 * Regular expression compiler
 * 
 * @author Fernando Gabrieli, fgabrieli at github
 */

function TreeNode(type, data) {
    // exposed for playing
    this.type = type ? type : '';

    // exposed for playing
    this.data = data ? data : {};

    // exposed for playing
    this.nodes = [];

    /**
     * Print subtree
     */
    var indent = 0;

    this.print = function() {
        indent = 0;

        printNode(this);
    }

    function printNode(node) {
        var whiteSpace = Array(indent * 4).join(' ');
        console.log(whiteSpace, node.type, node.data);

        indent++;

        for (var i = 0; i < node.nodes.length; i++) {
            printNode(node.nodes[i]);
        }

        indent--;
    }
}