/**
 * Regular expression compiler
 * 
 * @author Fernando Gabrieli, fgabrieli at github
 */

function LexicalAnalyzer(str) {
    var currentIdx = 0;

    this.analyze = function() {
        // precedence: *, +, alphabet, ?, |

        analyzeSuperSet();

        analyzeSet();

        analyzeAdd();

        group();

        analyzeKleene();

        group();

        analyzeOptional();

        group();

        analyzeAlphabet();

        group();

        console.log(str);
        
        analyzeOr();

        group();

        return str;
    }

    /**
     * Group consecutive symbols into one so we always have at most <symbol><operator><symbol>
     */
    function group() {
        resetIdx();

        var stack = [];

        var processStack = function() {
            if (stack.length > 1) {
                var regex = stack.join('');

                var symbol = new Symbol(regex)
                str = str.replace(regex, symbol.id);
            }

            stack = [];
        }

        do {
            if (isSymbol()) {
                stack.push(lexeme());
            } else {
                processStack();
            }
        } while (next());

        processStack();
    }

    function analyzeSuperSet() {
        str = str.replace('\\d', '[0-9]');

        str = str.replace('\\w', '[A-Za-z0-9_]');
    }

    function analyzeSet() {
        resetIdx();

        do {
            if (RegexHelper.isSet(lexeme())) {
                var expanded = expand();

                str = str.replace(lexeme(), expanded);

                return analyzeSet();
            }
        } while (next());
    }

    function expand() {
        var origLexeme = lexeme();

        var lex = origLexeme.replace('[', '').replace(']', '');

        var pos = lex.indexOf('-');
        while (pos !== -1) {
            var start = lex[pos - 1];
            var end = lex[pos + 1];

            var expanded = [];

            if (isNaN(start)) {
                var startCode = start.charCodeAt(0);
                var endCode = end.charCodeAt(0);

                for (var i = startCode; i <= endCode; i++) {
                    expanded.push(String.fromCharCode(i));
                }
            } else {
                for (var i = parseFloat(start); i <= parseFloat(end); i++) {
                    expanded.push(i);
                }
            }

            lex = lex.replace(start + '-' + end, expanded.join(''));

            pos = lex.indexOf('-');
        }

        return lex.split('').join('|');
    }

    function isReserved() {
        return [ '|', '*', '+', '?' ].indexOf(lexeme()) !== -1;
    }

    function analyzeAlphabet() {
        resetIdx();

        // XXX: analyze escaped chars as well

        do {
            // check escaping
            if (!isSymbol() && !isReserved()) {
                var symbol = new Symbol(lexeme());

                str = str.replace(lexeme(), symbol.id);

                return analyzeAlphabet();
            }
        } while (next());
    }

    function analyzeOptional() {
        resetIdx();

        do {
            if (RegexHelper.isOptional(lexeme())) {
                prev();
                var regex = lexeme();
                
                next();
                regex += lexeme();
                
                var symbol = new Symbol(regex);

                str = str.replace(regex, symbol.id);
                
                return analyzeOptional();
            }
        } while (next());
    }

    function analyzeAdd() {
        resetIdx();

        do {
            if (RegexHelper.isAdd(lexeme())) {
                prev();
                var regex = lexeme();

                next();
                regex += lexeme();

                var symbol = new Symbol(regex)
                str = str.replace(regex, symbol.id);

                return analyzeAdd();
            }
        } while (next());
    }

    function analyzeOr() {
        resetIdx();

        do {
            if (RegexHelper.isOr(lexeme())) {
                prev();
                var regex = lexeme();

                next();
                regex += lexeme();

                next();
                regex += lexeme();

                var symbol = new Symbol(regex)
                str = str.replace(regex, symbol.id);

                return analyzeOr();
            }
        } while (next());
    }

    function analyzeKleene() {
        resetIdx();

        do {
            if (RegexHelper.isKleene(lexeme())) {
                prev();
                var regex = lexeme();

                next();
                regex += lexeme();

                var symbol = new Symbol(regex)
                str = str.replace(regex, symbol.id);

                return analyzeKleene();
            }
        } while (next());
    }

    function resetIdx() {
        currentIdx = 0;
    }

    function prev() {
        if (currentIdx === 0)
            return false;

        if (str[--currentIdx] == '>') {
            while (str[--currentIdx] != '<') {
            }
            ;
        }

        return true;
    }

    function next() {
        if (str[currentIdx++] == '<') {
            while (str[currentIdx++] != '>') {
            }
            ;
        }

        return (currentIdx < str.length);
    }

    function lexeme() {
        var i = currentIdx;

        var start = i;

        var char = str[i++];

        if (char == '<') { // symbol
            while (str[i++] != '>') {
            }
            ;
        } else if (char == '[') { // set
            while (str[i++] != ']') {
            }
            ;
        }

        return str.substr(start, i - start);
    }

    function isSymbol() {
        return str[currentIdx] == '<';
    }

    /**
     * interface
     */

    this.next = next;

    this.prev = prev;

    this.lexeme = lexeme;

    this.isSymbol = isSymbol;
}