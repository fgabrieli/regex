var nfaInst = {};

$(document).ready(function() {
    // var regexStr = 'a+b*c*d+|c+d+e+';
    //var regexStr = 'a+b+c+d+e+f+g*|t';
    //var regexStr = 'p*c*f*';
    var regexStr= 'c*';
    
    console.log('orig regex', regexStr);

    var lexAnalyzer = new LexicalAnalyzer(regexStr);
    regexStr = lexAnalyzer.analyze();
    console.log(regexStr);

    var syntaxParser = new SyntaxParser();
    var syntaxTree = syntaxParser.parse(regexStr);
    syntaxTree.print();

    nfaInst = new NFA();
    nfaInst.createFromSyntaxTree(syntaxTree, true); // true = set as final

    nfaInst.draw($('#graph').get(0));

    // console.log(nfaInst.test2('abbbbcccddddt'));

    //console.log(nfaInst.move(nfaInst.getNfa(), 'p'));

})
