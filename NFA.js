/**
 * Regular expression compiler
 * 
 * @author Fernando Gabrieli, fgabrieli at github
 */

var TreeNode = require('./TreeNode').TreeNode;

var debug = require('./helper/Debug').debug;

var stateId = 0;

function State(type, char, isFinal) {
    this.type = type;

    this.char = char ? char : false;

    this.isFinal = isFinal ? isFinal : false;

    this.id = stateId++;

    // console.log('creating', type, char, this.id);

    // i leave this exposed for debugging purposes
    this.states = [];

    this.from = [];

    this.add = function() {
        for (var i = 0; i < arguments.length; i++) {
            var state = arguments[i];

            console.log(this.id, state.id, this.isEClosure() ? 'e-closure' : this.char, ' -->', state.isEClosure() ? 'e-closure' : state.char);

            state.from.push(this.id);

            this.states.push(state);
        }
    }

    this.isEClosure = function() {
        return this.type === 'e-closure';
    }

    this.getNext = function() {
        return this.states;
    }

    this.hasNext = function() {
        return this.states && this.states.length > 0;
    }

    this.print = function() {
        var printed = [];

        p(this);

        function p(state) {
            if (printed.indexOf(state) !== -1)
                return;

            console.log('(', state.char || state.type, ', id:', state.id, ', from:', state.from, ')', state.isFinal ? '[final]' : '');

            printed.push(state);

            for (var i = 0; i < state.states.length; i++) {
                p(state.states[i]);
            }

        }
    }

    this.test = function(str) {
        if (this.isFinal)
            return true;

        if (this.isEClosure()) {
            var nextStates = this.getNext();
            for (var j = 0; j < nextStates.length; j++) {
                if (nextStates[j].test(str)) {
                    return true;
                }
            }
        } else {
            if (this.char !== str[0]) {
                if (str.length > 1) {
                    return this.test(str.substr(1));
                }
            } else {
                var nextStates = this.getNext();
                for (var k = 0; k < nextStates.length; k++) {
                    if (nextStates[k].test(str.substr(1))) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}

/**
 * Class to implement the NFA (nondeterministic finite automaton)
 */
function NFA() {
    var FINAL = true;

    var nfa = false;

    var last = false;

    this.print = function() {
        nfa.print();
    }

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

        prevState.add(azState);

        var e1 = new State('e-closure');
        azState.add(e1);

        return e1;
    }

    /**
     * Create NFA state for the OR operation
     */
    function or(prevState, opn1, opn2) {
        var e1 = new State('e-closure');
        var e2 = new State('e-closure');
        prevState.add(e1, e2);

        var opn1First = opn1Last = false;
        if (opn1 instanceof TreeNode) {
            var nfaInst = new NFA();
            opn1First = nfaInst.createFromSyntaxTree(opn1);
            opn1Last = nfaInst.getLastState();
        } else {
            opn1First = opn1Last = new State('alphabet', opn1);
        }

        e1.add(opn1First);

        var opn2First = opn2Last = false;
        if (opn2 instanceof TreeNode) {
            var nfaInst = new NFA();
            opn2First = nfaInst.createFromSyntaxTree(opn2);
            opn2Last = nfaInst.getLastState();
        } else {
            opn2First = opn2Last = new State('alphabet', opn2);
        }

        e2.add(opn2First);

        var e3 = new State('e-closure');
        opn1Last.add(e3);
        opn2Last.add(e3);

        e3.add(prevState);

        return e3;
    }

    function kleene(prevState, opn1) {
        var opnState = new State('alphabet', opn1);
        prevState.add(opnState);

        var e1 = new State('e-closure');
        opnState.add(e1);

        var e2 = new State('e-closure');
        e2.add(opnState);
        e1.add(e2);

        var e3 = new State('e-closure');
        e2.add(e3);
        prevState.add(e3);

        return e3;
    }

    function add(prevState, opn1) {
        var opnState = new State('alphabet', opn1);
        prevState.add(opnState);

        var e1 = new State('e-closure');
        e1.add(opnState);

        opnState.add(e1);

        return e1;
    }
}

module.exports = {
    NFA : NFA
}