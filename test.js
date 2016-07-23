/**
 * Regular expression compiler
 * 
 * @author Fernando Gabrieli, fgabrieli at github
 */

var debug = false;

if (debug) {
    var LexicalAnalyzer = require('./LexicalAnalyzer.js').LexicalAnalyzer;

    var NFA = require('./NFA.js').NFA;

    var regexStr = 'p|d+c+';

    var lexAnalyzer = new LexicalAnalyzer(regexStr);
    regexStr = lexAnalyzer.analyze();
    console.log('regex to parse:', regexStr);

    var SyntaxParser = require('./SyntaxParser').SyntaxParser;

    var syntaxParser = new SyntaxParser();
    var syntaxTree = syntaxParser.parse(regexStr);
    syntaxTree.print();

    var nfaInst = new NFA();
    nfaInst.createFromSyntaxTree(syntaxTree, true); // true = set as final
    var nfa = nfaInst.getNfa();
    console.log('nfa', nfa);
    console.log(nfa.test('p'));
} else {
    var Tests = require('./Tests').Tests;
    Tests.run();
}