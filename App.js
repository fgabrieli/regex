$(document).ready(function() {
    // var regexStr = 'a+b*c*d+|c+d+e+';
    var regexStr = 'p|c*o';
    
    console.log('orig regex', regexStr);

    var lexAnalyzer = new LexicalAnalyzer(regexStr);
    regexStr = lexAnalyzer.analyze();
    console.log(regexStr);

    var syntaxParser = new SyntaxParser();
    var syntaxTree = syntaxParser.parse(regexStr);
    syntaxTree.print();

    var nfaInst = new NFA();
    nfaInst.createFromSyntaxTree(syntaxTree, true); // true = set as final

    nfaInst.draw($('#graph').get(0));

    // nfaInst.print();

    setTimeout(function() {
        var nfa = nfaInst.getNfa();
        console.log(nfa.test('o'));
    }, 2000);

})

