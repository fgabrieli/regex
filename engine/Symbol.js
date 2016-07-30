/**
 * Regular expression compiler
 * 
 * @author Fernando Gabrieli, fgabrieli at github
 */

function SymbolTable() {
    var table = [];
    
    this.add = function(symbol) {
        symbol.id = '<s' + table.length + '>';

        table.push(symbol);
    }
    
    this.getByLexeme = function(lexeme) {
        var entry = parseFloat(lexeme.substr(2).replace('>', ''));

        return table[entry];
    }
}

function Symbol(data) {
    this.data = data;
    
    symbolTable.add(this);
}

var symbolTable = new SymbolTable();