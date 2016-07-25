/**
 * Regular expression compiler
 * 
 * @author Fernando Gabrieli, fgabrieli at github
 */

var DEBUG = false;

var debug = DEBUG ? function() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }

    console.log.apply(null, args);
} : function() {
};

module.exports = {
    debug : debug
}