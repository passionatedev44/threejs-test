//******** **********
// Lines Grpoup module - ( r0 )
// By Dustin Pfister : https://dustinpfister.github.io/
//******** **********
var LineGroup = (function(){
    //******** **********
    // BUILT IN TYPE(S)
    //******** **********
    var TYPES = {};
    // tri
    TYPES.rnd3 = {
        key: 'rnd3',
        // default options such as the number of lines, and how many points per line
        opt: {
            lineCount: 3,
            pointsPerLine: 4
        },
        // called just once in LineGroup.create before lines are created
        // this can be used to add generated options that are not part of the
        // start state object
        beforeCreate: function(opt, lineGroup){},

        // for frame method used to set 'current state' with 'startState', and 'frameData'
        forFrame : function(state, startState, frameData){

        },

        // create/update points of a line in the line group with 'current state' object
        forLine : function(points, state, lineIndex, lineCount){

        }
    };

    //******** **********
    // PUBLIC API
    //******** **********
    var api = {};

    // create a type
    api.create = function(typeKey, opt){
        typeKey = typeKey || 'rnd3';
        typeObj = TYPES[typeKey];
        // make the line group
        var lineGroup = new THREE.Group();
        // clone opt object from typeObj of given typeKey
        opt = opt || {};
        // use given option, or default options to create an opt object
        Object.keys( typeObj.opt ).forEach(function(key){
            opt[key] = opt[key] || typeObj.opt[key]; 
        });

        // create blank points
        var groupPoints = [];
        var lineIndex = 0;
        while(lineIndex < opt.lineCount){
            var pointIndex = 0;
            var points = [];
            while(pointIndex < opt.pointsPerLine){
                points.push( new THREE.Vector3() )
                pointIndex += 1;
            }
            groupPoints.push(points);
            lineIndex += 1;
        }
        lineGroup.userData.groupPoints = groupPoints;

        // frame data object
        var frameData = {
            frame: 0,
            frameMax: 30
        };

        return lineGroup;
    };

    // load a type
    api.load = function(typeObj){
        TYPES[typeObj.key] = typeObj;
    };

    // set a line group with the given frame, maxFrame, and initState
    api.set = function(lineGroup, frame, maxFrame, startState){
    };

    // return public API
    return api;
}());