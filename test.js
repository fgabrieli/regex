/**
 * Regular expression compiler
 * 
 * @author Fernando Gabrieli, fgabrieli at github
 */

var LexicalAnalyzer = require('./LexicalAnalyzer.js').LexicalAnalyzer;

var NFA = require('./NFA.js').NFA;

var regexStr = 'c+d+e+';

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
//nfa.print();

function testRegex(str, expected) {
    if (nfa.test(str) != expected)
        throw 'Fails for ' + str;
    else
        console.log('[ok]', str)
}

testRegex('cccccdddddeeeee', true);
//testRegex('rccccc', true);


//console.log(nfa.test('rccccc'));