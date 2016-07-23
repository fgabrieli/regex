/**
 * Regular expression compiler
 * 
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

//            if (lexAnalyzer.isSymbol()) {
//                var subRegex = symbolTable.getByLexeme(lexeme).data;
//                node = new SyntaxParser().parse(subRegex);
//
//                stack.push(node);
//                
//                addNode = false;
//            } 
            
            if (regHelper.isOr(lexeme)) {
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
                
                stack = [];
            }

        } while (lexAnalyzer.next());

        if (stack.length > 0) {
            for (var i = 0; i < stack.length; i++) {
                var node = false;
                
                var entry = stack[i];
                
                if (entry[0] === '<') {
                    var subRegex = symbolTable.getByLexeme(entry).data;
                    node = new SyntaxParser().parse(subRegex);
                } else {
                    node = new TreeNode('alphabet', {
                        char : entry
                    })
                }
                
                if (!prevNode) {
                    prevNode = node;
                    parent = prevNode;
                } else {
                    parent = new TreeNode('empty'); // connect pair of nodes
                    parent.nodes.push(prevNode, node);
                    prevNode = parent;
                }
            }
        }
        
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
        lexAnalyzer.prev();
        
        var opn1 = lexAnalyzer.isSymbol() ? new SyntaxParser().parse(lexAnalyzer.lexeme()) : lexAnalyzer.lexeme();
        
        lexAnalyzer.next();
        lexAnalyzer.next();

        var opn2 = lexAnalyzer.isSymbol() ? new SyntaxParser().parse(lexAnalyzer.lexeme()) : lexAnalyzer.lexeme();

        return new TreeNode('or', {
            opn1 : opn1,
            opn2 : opn2
        });
    }

    function add(lexAnalyzer) {
        lexAnalyzer.prev();
        
        var node = new TreeNode('add', {
            opn1 : lexAnalyzer.lexeme()
        })
        
        lexAnalyzer.next();
        lexAnalyzer.next();
        
        return node;
    }

    function kleene(lexAnalyzer) {
        lexAnalyzer.prev();
        
        var node = new TreeNode('kleene', {
            opn1 : lexAnalyzer.lexeme()
        })
        
        lexAnalyzer.next();
        lexAnalyzer.next();
        
        return node;
    }
}

module.exports = {
    SyntaxParser : SyntaxParser
}
