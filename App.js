var nfaInst = {};

$(document).ready(function() {
    // var regexStr = 'a+b*c*d+|c+d+e+';
    //var regexStr = 'a+b+c+d+e+f+g*|t';
    //var regexStr = 'p*c*f*';
    //var regexStr= 'A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|0|1|2|3|4|5|6|7|8|9|_*a';
    var regexStr= 'p|c|d';
    
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
