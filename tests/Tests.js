/**
 * Regular expression compiler
 * 
 * @author Fernando Gabrieli, fgabrieli at github
 */

/**
 * Runs all test cases for the regex compiler
 */

var Tests = {
    debug : false,

    success : 0,

    isTesting : false,

    test : function(regexStr, cases) {
        var origRegex = regexStr;

        var lexAnalyzer = new LexicalAnalyzer(regexStr);
        regexStr = lexAnalyzer.analyze();
        console.log(regexStr);

        var syntaxParser = new SyntaxParser();
        var syntaxTree = syntaxParser.parse(regexStr);

        var nfaInst = new NFA();
        nfaInst.createFromSyntaxTree(syntaxTree, true); // true = set as final

        for (var i = 0; i < cases.length; i++) {
            var str = cases[i].str;

            // expected is true by default
            var expected = typeof cases[i].expected !== 'undefined' ? cases[i].expected : true;

            var result = nfaInst.test(str);
            if (result !== expected) {
                throw 'Failed case with string: "' + str + '" for regex ' + origRegex + ', expecting ' + expected + ', outcome: ' + result;
                break;
            }
        }

        this.success += cases.length;
    },

    run : function() {
        this.success = 0;

        this.isTesting = true;

        this.test('a+b+c+d+e+f+g*|t', [ {
            str : 't'
        }, {
            str : 'aaaabcdefg'
        }, {
            str : 'tt'
        } ])

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
            expected : true
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

        this.test('p*d+', [ {
            str : 'p',
            expected : false
        }, {
            str : 'ddddd',
            expected : true
        } ])

        this.test('p|d+c+', [ {
            str : 'p'
        } ])

        this.test('abc', [ {
            str : 'x',
            expected : false
        }, {
            str : 'a',
            expected : false
        }, {
            str : 'b',
            expected : false
        }, {
            str : 'abc'
        } ])

        this.test('a+b*c*d+|c+d+e+', [ {
            str : 'cde'
        }, {
            str : 'ad'
        }, {
            str : 'abcd'
        }, {
            str : 'adc'
        }, {
            str : 'abccd'
        }, {
            str : 'cde'
        }, {
            str : 'aaaaaaaaaaaaaaaaaaaaaaaaacde'
        }, {
            str : 'abcdx',
            expected : true
        }, {
            str : 'x',
            expected : false
        } ])

        this.test('a+|b+|c+', [ {
            str : 'a'
        }, {
            str : 'abc'
        }, {
            str : 'bbbbbbbbbbbb'
        }, {
            str : 'bccccccccccbcbbcbcbc'
        }, {
            str : 'aaaaaaaaabbbbbbbbcbcbcbcbcbcbbcbcbcbcb'
        } ])

        this.test('a|b|c|d|e|f|g|h', [ {
            str : 'a'
        }, {
            str : 'abc'
        }, {
            str : 'h'
        } ])

        this.test('abcdef+g*', [ {
            str : 'a',
            expected : false
        }, {
            str : 'abcde',
            expected : false
        }, {
            str : 'abcdefffff'
        }, {
            str : 'abcdefffffgggggggggggg'
        } ])

        this.test('a', [ {
            str : 'b',
            expected : false
        } ])

        this.test('abc', [ {
            str : 'x',
            expected : false
        } ])

        this.test('93n', [ {
            str : '93n'
        }, {
            str : '93ny'
        } ])

        this.test('a+b+c+d*', [ {
            str : 'abcd'
        } ])

        this.test('pp*', [ {
            str : 'q',
            expected : false
        } ])

        this.test('fg', [ {
            str : 'fg@'
        } ])

        this.test('p+d*e+', [ {
            str : 'p',
            expected : false
        }, {
            str : 'pde'
        }, {
            str : 'pe'
        }, {
            str : 'ep',
            expected : false
        } ])

        this.test('p+d*|e+', [ {
            str : 'ep'
        } ])

        // notice the \\d because \ in strings must be escaped to obtain the
        // superset \d
        this.test('\\d|w', [ {
            str : '0'
        } ])

        this.test('a|p*o', [ {
            str : 'x',
            expected : false
        } ])

        this.test('\\wabc', [ {
            str : '8',
            expected : false
        } ])


        // XXX: still failing here, god help us
         this.test('\\w*a', [ {
            str : 'abca'
        } ])
        

        this.isTesting = true;

        console.log('Result: ' + this.success + ' cases executed successfully. Good job my friend.');
    }
}