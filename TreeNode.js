/**
 * Regular expression compiler
 * 
 * @author Fernando Gabrieli, fgabrieli at github
 */

function TreeNode(type, data) {
    this.type = type ? type : '';

    this.data = data ? data : {};

    // i leave this exposed for debugging purposes
    this.nodes = [];

    /**
     * Print tree for the parsed regex.
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

module.exports = {
    TreeNode : TreeNode
}