/**
 * Regular expression compiler
 * 
 * @author Fernando Gabrieli, fgabrieli at github
 */

var RegexHelper = {
    isKleene : function(c) {
        return c === '*';
    },

    isAdd : function(c) {
        return c === '+';
    },

    isOr : function(c) {
        return c === '|';
    },

    isSet : function(str) {
        return str[0] === '[';
    }
}

module.exports = {
    RegexHelper : RegexHelper
}