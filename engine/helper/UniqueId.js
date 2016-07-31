/**
 * Regular expression compiler
 * 
 * @author Fernando Gabrieli, fgabrieli at github
 */

var UniqueId = {
    lastId : 0,

    reset : function() {
        this.lastId = 0;
    },

    get : function() {
        return this.lastId++;
    }
}