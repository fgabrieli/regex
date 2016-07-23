var LexicalAnalyzer = require('./LexicalAnalyzer.js').LexicalAnalyzer;

var SyntaxParser = require('./SyntaxParser').SyntaxParser;

var NFA = require('./NFA.js').NFA;

var Tests = {
    debug : false,

    success : 0,

    test : function(regexStr, cases) {
        var origRegex = regexStr;

        var lexAnalyzer = new LexicalAnalyzer(regexStr);
        regexStr = lexAnalyzer.analyze();

        var syntaxParser = new SyntaxParser();
        var syntaxTree = syntaxParser.parse(regexStr);

        var nfaInst = new NFA();
        nfaInst.createFromSyntaxTree(syntaxTree, true); // true = set as final
        var nfa = nfaInst.getNfa();

        for (var i = 0; i < cases.length; i++) {
            if (this.debug) {
                console.log('running case: ', origRegex, cases[i].str);

                syntaxTree.print();

                console.log(nfa);
            }

            var str = cases[i].str;

            // expected is true by default
            var expected = typeof cases[i].expected !== 'undefined' ? cases[i].expected : true;

            if (nfa.test(str) != expected) {
                throw 'Failed case with string: "' + str + '" for regex ' + origRegex + ', expecting ' + expected;
            }
        }

        if (this.debug) {
            console.log(cases.length, 'case(s) executed successfully');
        }

        this.success += cases.length;
    },

    run : function() {
        this.test('c*', [ {
            str : 'c',
            expected : true
        }, {
            str : 'cccc',
            expected : true
        }, {
            str : '',
            expected : true
        } ])

        this.test('p|c', [ {
            str : 'pc',
            expected : true
        }, {
            str : 'px',
            expected : true
        }, {
            str : 'x',
            expected : false
        }, {
            str : 'ppppppppppppppppppp',
            expected : true
        } ])

        this.test('p|c+d*t+', [ {
            str : 'p',
            expected : false
        }, {
            str : 'pt',
            expected : true
        }, {
            str : 'ct',
            expected : true
        }, {
            str : 'dfdfdf',
            expected : false
        } ])

        this.test('b+', [ {
            str : 'b',
            expected : true
        }, {
            str : 'c',
            expected : false
        }, {
            str : 'bc',
            expected : true
        } ])

        this.test('t+|c', [ {
            str : 't',
            expected : true
        }, {
            str : 'cccc',
            expected : true
        }, {
            str : 'tc',
            expected : true
        }, {
            str : 'x',
            expected : false
        } ]);

        // TODO: should tell the regex is wrong detecting the syntax error
        this.test('+', [ {
            str : 'pp',
            expected : false
        } ])

        this.test('p+c+d+|q|r|t', [ {
            str : 'pcdq',
            expected : true
        }, {
            str : 'pcdq'
        } ])
        
        this.test('p*d+', [{
            str : 'p', 
            expected : false
        }, {
            str : 'ddddd',
            expected : true
        }])
        
        this.test('p|d+c+', [{
            str : 'p'
        }])

        console.log(this.success, ' cases executed successfully');
    }
}

module.exports = {
    Tests : Tests
}