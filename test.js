/**
 * Regular expression compiler
 * 
 * @author Fernando Gabrieli, fgabrieli at github
 */

var LexicalAnalyzer = require('./LexicalAnalyzer.js').LexicalAnalyzer;

var NFA = require('./NFA.js').NFA ;

var regexStr = 'qt*';

var lexAnalyzer = new LexicalAnalyzer(regexStr);
regexStr = lexAnalyzer.analyze();
console.log('regex to parse:', regexStr);

var SyntaxParser = require('./SyntaxParser').SyntaxParser;

var syntaxParser = new SyntaxParser();
var syntaxTree = syntaxParser.parse(regexStr);
//syntaxTree.print();


var nfaInst = new NFA();
nfaInst.createFromSyntaxTree(syntaxTree);
var nfa = nfaInst.getNfa();
nfa.print();

console.log(nfa.test(''));