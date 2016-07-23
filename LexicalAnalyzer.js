/**
 * Lexical Analyzer
 * 
 * @author Fernando Gabrieli, fgabrieli at github
 */

var extend = require('extend');

var RegexHelper = require('./helper/RegexHelper').RegexHelper;

var Symbol = require('./Symbol').Symbol;
var symbolTable = require('./Symbol');

function LexicalAnalyzer(str) {
    var currentIdx = 0;

    this.analyze = function() {
        // precedence: +, *, |, alphabet
        
        analyzeAdd();

        group();

        analyzeKleene();
        
        group();
        
        analyzeOr();

        group();

        analyzeAlphabet();

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
                
                stack = [];
            }
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

    function analyzeAlphabet() {
        resetIdx();

        do {
            if (!isSymbol()) {
                var symbol = new Symbol(lexeme());

                str = str.replace(lexeme(), symbol.id);

                return analyzeAlphabet();
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

        if (str[i++] == '<') {
            while (str[i++] != '>') {
            }
            ;
        }

        return str.substr(start, i - start);
    }

    function isSymbol() {
        return str[currentIdx] == '<';
    }

    this.next = next;

    this.prev = prev;

    this.lexeme = lexeme;

    this.isSymbol = isSymbol;
}

module.exports = {
    LexicalAnalyzer : LexicalAnalyzer
}