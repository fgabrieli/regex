/**
 * @author Fernando Gabrieli, fgabrieli at github
 */

var LexicalAnalyzer = require('./LexicalAnalyzer').LexicalAnalyzer;

var Symbol = require('./Symbol').Symbol;

var symbolTable = require('./Symbol').symbolTable;

var TreeNode = require('./TreeNode').TreeNode;

var regHelper = require('./helper/RegexHelper').RegexHelper;

function SyntaxParser() {
    var stack = [];

    var tree = {};

    var str = '';

    this.parse = function(strToParse) {
        if (typeof strToParse === 'undefined' || strToParse.length === 0) {
            throw 'Regex to be parsed is not valid';
        }

        init(strToParse);

        var lexAnalyzer = new LexicalAnalyzer(strToParse);

        var parent = false, prevNode = false, addNode = false;

        do {
            var lexeme = lexAnalyzer.lexeme();

            if (lexAnalyzer.isSymbol()) {
                var subRegex = symbolTable.getByLexeme(lexeme).data;
                node = new SyntaxParser().parse(subRegex);

                addNode = true;
            } else if (regHelper.isOr(lexeme)) {
                node = or(lexAnalyzer);

                addNode = true;
            } else if (regHelper.isAdd(lexeme)) {
                node = add(lexAnalyzer);

                addNode = true;
            } else if (regHelper.isKleene(lexeme)) {
                node = kleene(lexAnalyzer);

                addNode = true;
            } else {
                stack.push(lexeme);
            }

            if (addNode) {
                if (!prevNode) {
                    prevNode = node;

                    // only for the case when the regex has one node for it's
                    // syntax tree, say "a|b"
                    parent = prevNode;
                } else {
                    parent = new TreeNode('empty'); // connect pair of nodes
                    parent.nodes.push(prevNode, node);
                    prevNode = parent;
                }

                addNode = false;
            }

        } while (lexAnalyzer.next());

        tree = parent;

        return tree;
    }

    function init(strToParse) {
        str = strToParse;
        charIndex = 0;
        stack = [];
    }

    var charIndex = 0;

    function nextChar() {
        return charIndex < str.length ? str[charIndex++] : false;
    }

    function or(lexAnalyzer) {
        lexAnalyzer.next();

        return new TreeNode('or', {
            opn1 : stack.shift(),
            opn2 : lexAnalyzer.lexeme()
        });
    }

    function add(lexAnalyzer) {
        return new TreeNode('add', {
            opn1 : stack.shift()
        })
    }

    function kleene(lexAnalyzer) {
        return new TreeNode('kleene', {
            opn1 : stack.shift()
        })
    }
}

module.exports = {
    SyntaxParser : SyntaxParser
}
