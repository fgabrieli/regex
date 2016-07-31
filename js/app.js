var app = {
    init : function() {
    },

    test : function() {
        var regexStr = $('#regexpr').val();
        if (regexStr.length == 0)
            return;

        var lexAnalyzer = new LexicalAnalyzer(regexStr);
        regexStr = lexAnalyzer.analyze();

        var syntaxParser = new SyntaxParser();
        var syntaxTree = syntaxParser.parse(regexStr);
        syntaxTree.print();

        nfaInst = new NFA();
        nfaInst.createFromSyntaxTree(syntaxTree, true); // true = set as final

        nfaInst.draw($('#nfa').get(0));

        var strToTest = $('#search').val();
        if (strToTest.length > 0) {
            var result = nfaInst.test(strToTest);

            $('#result').html(result ? 'matches' : 'no match');

            var classToAdd = result ? 'matches' : 'no-match';
            $('#result').removeClass('matches no-match').addClass(classToAdd);
        }

        this.toggleTestPanel();
    },

    toggleTestPanel : function() {
        $('#test-panel').toggle();
        $('.btn-show-test-panel').toggle();
        $('.looking-for-panel').toggle();
        $('.result-panel').toggle();
    }
};

$(document).ready(function() {
    app.init();
});