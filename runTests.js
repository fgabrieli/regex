/**
 * Regular expression compiler
 * 
 * @author Fernando Gabrieli, fgabrieli at github
 */

// set to true for testing one regex at a time (i.e. if there is a test fail)
var debug = true;

if (debug) {
    var LexicalAnalyzer = require('./LexicalAnalyzer.js').LexicalAnalyzer;

    var NFA = require('./NFA.js').NFA;

    var regexStr = '[az]';

    console.log('orig regex', regexStr);

    var lexAnalyzer = new LexicalAnalyzer(regexStr);
    regexStr = lexAnalyzer.analyze();

    var SyntaxParser = require('./SyntaxParser').SyntaxParser;

    var syntaxParser = new SyntaxParser();
    var syntaxTree = syntaxParser.parse(regexStr);
    syntaxTree.print();

    var nfaInst = new NFA();
    nfaInst.createFromSyntaxTree(syntaxTree, true); // true = set as final
    var nfa = nfaInst.getNfa();
    console.log(nfa.test('b'));
} else {
    var Tests = require('./Tests').Tests;
    Tests.run();
}