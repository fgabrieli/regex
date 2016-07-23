// NFA's have states (which are actually nodes of a graph since the nfa itself
// is a graph)

var TreeNode = require('./TreeNode').TreeNode;

function State(type, char, isFinal) {
    this.type = type;

    this.char = char ? char : false;

    this.isFinal = isFinal ? isFinal : false;

    // i leave this exposed for debugging purposes
    this.states = [];

    this.isEClosure = function() {
        return this.type === 'e-closure';
    }

    this.getNext = function() {
        return this.states;
    }

    this.hasNext = function() {
        return this.states && this.states.length > 0;
    }

    /**
     * Print tree for the parsed regex.
     */
    var printed = [];

    this.print = function() {
        printed = [];

        printStates(this);
    }

    function printStates(state) {
        if (printed.indexOf(state) !== -1)
            return;

        console.log(state.type, state.char, state.states);

        printed.push(state);

        for (var i = 0; i < state.states.length; i++) {
            printStates(state.states[i]);
        }
    }

    this.test = function(str) {
        //console.log('checking state', this);
        
        /*
        if (str.length == 0)
            return true;
        */
        
        if (this.isFinal)
            return true;

        if (this.isEClosure() && this.hasNext()) {
            var nextStates = this.getNext();
            for (var j = 0; j < nextStates.length; j++) {
                if(nextStates[j].test(str)) {
                    return true;
                }
            }
        }

        if (this.char === str[0]) {
            if (!this.hasNext())
                return true;
            
            var nextStates = this.getNext();
            for (var j = 0; j < nextStates.length; j++) {
                if (nextStates[j].test(str.substr(1))) {
                    return true;
                }
            }
        }

        return false;
    }
}

function NFA() {
    var FINAL = true;
    
    var nfa = false;
    
    var last = false;

    this.getNfa = function() {
        return nfa;
    }

    this.getLastState = function() {
        return last;
    }
    
    this.createFromSyntaxTree = function(syntaxTree, setFinal) {
        // instead of an initial state i just set an e-closure
        nfa = new State('e-closure');

        last = addStates(nfa, syntaxTree);

        if (setFinal) {
            last.isFinal = true;
        }
        
        return nfa;
    }

    this.test = function(str) {
        return nfa.test(str);
    }

    /**
     * @param syntax
     *            tree root node
     */
    function addStates(state, node) {
        var lastState = false;

        if (node.type == 'or') {
            lastState = or(state, node.data.opn1, node.data.opn2);
        } else if (node.type == 'add') {
            lastState = add(state, node.data.opn1);
        } else if (node.type == 'kleene') {
            lastState = kleene(state, node.data.opn1);
        } else if (node.type == 'alphabet') {
            lastState = alphabet(state, node.data.char);
        } else {
            lastState = state;
        }

        for (var i = 0; i < node.nodes.length; i++) {
            lastState = addStates(lastState, node.nodes[i]);
        }

        return lastState;
    }

    /**
     * Create NFA state for chars (alphabet, sigma)
     */
    function alphabet(prevState, char) {
        var azState = new State('alphabet', char);
        
        prevState.states.push(azState);
        
        return azState;
    }
    
    /**
     * Create NFA state for the OR operation
     */
    function or(prevState, opn1, opn2) {
        var e1 = new State('e-closure');
        var e2 = new State('e-closure');
        prevState.states.push(e1, e2);

        var opn1First = opn1Last = false;
        if (opn1 instanceof TreeNode) {
            var nfaInst = new NFA();
            opn1First = nfaInst.createFromSyntaxTree(opn1);
            opn1Last = nfaInst.getLastState();
        } else {
            opn1First = opn1Last = new State('alphabet', opn1);
        }
        
        e1.states.push(opn1First);

        
        var opn2First = opn2Last = false;
        if (opn2 instanceof TreeNode) {
            var nfaInst = new NFA();
            opn2First = nfaInst.createFromSyntaxTree(opn2);
            opn2Last = nfaInst.getLastState();
        } else {
            opn2First = opn2Last = new State('alphabet', opn2);
        }
        
        e1.states.push(opn2First);

//        var stateOpn2 = opn2 instanceof TreeNode ? new NFA().createFromSyntaxTree(opn2).getLastState() :  new State('alphabet', opn2);
//        e2.states.push(stateOpn2);
        

        var e3 = new State('e-closure');
        opn1Last.states.push(e3);
        opn2Last.states.push(e3);

        e3.states.push(prevState);

        return e3;
    }

    function kleene(prevState, opn1) {
        var opnState = new State('alphabet', opn1);
        prevState.states.push(opnState);

        var e1 = new State('e-closure');
        opnState.states.push(e1);

        prevState.states.push(e1);

        return e1;
    }

    function add(prevState, opn1) {
        var opnState = new State('alphabet', opn1);
        prevState.states.push(opnState);

        var e1 = new State('e-closure');
        e1.states.push(opnState);

        opnState.states.push(e1);

        return e1;
    }
}

module.exports = {
    NFA : NFA
}