/**
 * Regex helper singleton
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
    }
}

module.exports = {
    RegexHelper : RegexHelper
}