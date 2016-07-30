/**
 * Helper to draw NFAs using Vis class.
 * 
 * @require visjs.org
 */

var NFADebug = {
    // VIS (lib) network
    net : {},

    // path followed while testing a regex to debug it
    path : [],

    // step in the path (see above)
    step : -1,

    init : function() {
        this.bindKeys();
    },

    loop : false,

    reset : function() {
        this.step = -1;
        
        this.path = [];
    },

    play : function() {
        this.step = -1;

        var t = this;

        for (var i = 0; i < this.path.length; i++) {
            setTimeout(function() {
                t.nextStep();
            }, i * 1000);
        }
    },

    bindKeys : function() {
        var t = this;

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

    addPath : function(from, to, lookingFor) {
        if (from.id === to.id)
            return;

        this.path.push({
            from : from,
            to : to,
            lookingFor : lookingFor
        });
    },

    prevStep : function() {
        if (this.step <= 0)
            return;

        var stepData = this.path[--this.step];

        $('#looking-for').html(stepData.lookingFor);
        
        this.selectEdge(stepData.from.id + '-' + stepData.to.id);
    },

    nextStep : function() {
        if (this.step + 1 == this.path.length)
            return;

        var stepData = this.path[++this.step];

        $('#looking-for').text(stepData.lookingFor);

        this.selectEdge(stepData.from.id + '-' + stepData.to.id);
    },

    draw : function(nfa, targetEl) {
        var visited = [];

        var nodes = [];

        var edges = [];

        visit(nfa);

        function visit(state) {
            if (visited.indexOf(state) !== -1)
                return;

            visited.push(state);

            nodes.push(getNode(state));

            for (var i = 0; i < state.states.length; i++) {
                var nextState = state.states[i];

                edges.push({
                    id : state.id + '-' + nextState.id,
                    from : state.id,
                    to : nextState.id,
                    arrows : 'to',
                    label : nextState.isEClosure() ? '(E)' : nextState.char
                });

                visit(state.states[i]);
            }
        }

        function getNode(state) {
            return {
                id : state.id,
                color : state.isFinal === true ? {background : 'white', border : 'red'} : {background : 'white'},
                label : state.id
            }
        }

        this.render(targetEl, nodes, edges);
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