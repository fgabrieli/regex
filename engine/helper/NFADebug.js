/**
 * Helper to draw and "debug" NFAs using Vis library.
 * 
 * @see http://visjs.org
 * 
 * @author Fernando Gabrieli, fgabrieli at github
 */

var NFADebug = {
    // VIS (lib) network
    net : {},

    // path followed while testing a regex so we can re-play it
    path : [],

    // step in the path (see above)
    step : -1,

    init : function() {
        // allow left-key and right-key to rewind/forward the test
        this.bindKeys();
    },

    reset : function() {
        this.step = -1;

        this.path = [];
    },

    bindKeys : function() {
        var t = this;

        // allow left-key and right-key to rewind/forward the test
        $(document).keydown(function(e) {
            switch (e.which) {
            case 37: // left
                t.prevStep();
                break;

            case 39: // right
                t.nextStep();
                break;
            }
        });
    },

    selectEdge : function(edgeId) {
        this.net.selectEdges([ edgeId ]);
    },

    selectNodes : function(nodes) {
        var n = typeof nodes !== 'array' ? [ nodes ] : n;
        this.net.selectNodes(n);
    },

    addPath : function(from, to, lookingFor) {
        if (from.id === to.id)
            return;

        this.path.push({
            from : from,
            to : to,
            lookingFor : lookingFor
        // char we are looking for
        });
    },

    /**
     * Go backwards when debugging.
     */
    prevStep : function() {
        if (this.step <= 0)
            return;

        var stepData = this.path[--this.step];

        this.updateLookingFor(stepData);
        
        this.selectEdge(stepData.from.id + '-' + stepData.to.id);
    },

    /**
     * Go forward when debugging.
     */
    nextStep : function() {
        if (this.step + 1 == this.path.length)
            return;

        var stepData = this.path[++this.step];

        this.updateLookingFor(stepData);

        this.selectEdge(stepData.from.id + '-' + stepData.to.id);
    },

    updateLookingFor : function(stepData) {
        $('#looking-for').html(stepData.lookingFor.length ? stepData.lookingFor : '-');
    },

    /**
     * Draw the NFA using Vis library.
     * 
     * @param State
     *            instance
     * @param DOM
     *            element to render the graph to
     */
    draw : function(nfa, targetEl) {
        var visited = [];

        var nodes = [];

        var edges = [];

        visit.call(this, nfa);

        this.render(targetEl, nodes, edges);


        function visit(state) {
            if (visited.indexOf(state) !== -1)
                return;

            visited.push(state);

            nodes.push(this.getNodeData(state));

            for (var i = 0; i < state.states.length; i++) {
                var nextState = state.states[i];

                edges.push({
                    id : state.id + '-' + nextState.id,
                    from : state.id,
                    to : nextState.id,
                    arrows : 'to',
                    label : nextState.isEClosure() ? '(E)' : nextState.char
                });

                visit.call(this, state.states[i]);
            }
        }
    },

    getNodeData : function(state) {
        var color = false;

        if (state.id === 0) { // initial state
            color = {
                background : 'white',
                border : 'green'
            }
        } else if (state.isFinal) {
            color = {
                background : 'white',
                border : 'red'
            };
        } else {
            color = {
                background : 'white'
            };
        }

        return {
            id : state.id,
            color : color,
            label : state.id
        }
    },

    render : function(targetEl, nodeData, edgeData) {
        // create an array with nodes
        var nodes = new vis.DataSet(nodeData);

        // create an array with edges
        var edges = new vis.DataSet(edgeData);

        // create a network
        var container = targetEl;
        var data = {
            nodes : nodes,
            edges : edges
        };

        var options = {
            width : '100%',
            height : '100%',
            layout : {
                randomSeed : 1,
            },
            edges : {
                smooth : {
                    type : 'cubicBezier',
                    forceDirection : 'horizontal',
                    roundness : 1
                },
                arrows : {
                    to : true
                }
            }
        };

        this.net = new vis.Network(container, data, options);
    }
}

{
    $(document).ready(function() {
        NFADebug.init();
    })
}