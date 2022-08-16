// seq-hooks-r1.js
// sequence hooks library from threejs-examples-sequence-hooks
// public getPer and getBias methods
var seqHooks = (function () {
    var api = {};
    //******** **********
    // HELPERS
    //******** **********
    // no operation
    var noop = function(){};
    // internal get per method
    var getPer = function(a, b){
        return a / b;
    };
    // internal get bias method
    var getBias = function(per){
        return 1 - Math.abs( 0.5 - per ) / 0.5;
    };
    // get total secs value helper
    var getTotalSecs = function(seq){
        return seq.objects.reduce(function(acc, obj){ return acc + (obj.secs || 0) }, 0);
    };
    //******** **********
    // CREATE - create and return a new seq object
    //******** **********
    // create new seq object method
    api.create = function(opt){
        opt = opt || {};
        opt.setPerValues = opt.setPerValues === undefined ? true : false;
        var seq = {};
        seq.objectIndex = 0;
        seq.per = 0;
        seq.bias = 0;
        seq.frame = 0;
        seq.frameMax = 100;
        // parse hooks
        seq.beforeObjects = opt.beforeObjects || noop;
        seq.afterObjects = opt.afterObjects || noop;
        // parse objects
        seq.objects = opt.objects || [];
        seq.objects = seq.objects.map(function(obj){
            obj.per = obj.per === undefined ? 0 : obj.per;
            obj.secs = obj.secs === undefined ? 0 : obj.secs;
            obj.data = obj.data || {};
            obj.update = obj.update || noop;
            return obj;
        });
        // set per values is part of the create process
        if(opt.setPerValues){
            api.setPerValues(seq, opt.fps === undefined ? 30: opt.fps);
        }
        return seq;
    };


    var createGetPerMethod = function(seq){
        return function(count, objectPer){
            // by default return current 1 count per value for the current sequence object
            count = count === undefined ? 1 : count;
            objectPer = objectPer === undefined ? true: objectPer;
            // if I want a objectPer value
            var a = seq.partFrame, b = seq.partFrameMax;
            // not object per
            if(!objectPer){
                a = seq.frame; 
                b = seq.frameMax;
            }
            // base p value
            var p = a / b;
            // return base p value effected by count
            return p * count % 1;
        };
    };

    //******** **********
    // SET FRAME
    //******** **********
    // update the given seq object by way of a frame, and maxFrame value
    api.setFrame = function(seq, frame, frameMax){
        seq.frame = frame === undefined ? 0 : frame;
        seq.frameMax = frameMax === undefined ? 100 : frameMax;

        // set main per and bias values
        seq.per = getPer(seq.frame, seq.frameMax);
        seq.bias = getBias(seq.per);

        seq.getPer = createGetPerMethod(seq);

        // update object index
        seq.objectIndex = 0;
        var i = 0, len = seq.objects.length;
        while(i < len){
            var obj = seq.objects[i];
            var per2 = 1;
            if(seq.objects[i + 1] != undefined){
                per2 = seq.objects[i + 1].per;
            }
            // if this is the current object update object 
            // index as well as other relevant values
            if(seq.per >= obj.per && seq.per < per2){
                seq.objectIndex = i;
                seq.partFrameMax = Math.floor( (per2 - obj.per) * seq.frameMax );
                seq.partFrame = seq.frame - Math.floor(seq.frameMax * obj.per);
                seq.partPer = getPer(seq.partFrame, seq.partFrameMax);
                seq.partBias = getBias(seq.partPer);
                break;
            }
            i += 1;
        }
        // call before hook
        seq.beforeObjects(seq);
        // call update for current object
        var obj = seq.objects[seq.objectIndex];
        if(obj){
            seq.obj = obj;
            obj.update(seq, seq.partPer, seq.partBias, obj);
        }
        // call after objects hook
        seq.afterObjects(seq);
    };
    //******** **********
    // OTHER PUBLIC METHODS
    //******** **********
    // just get an array of per values based on sec values for each object, and DO NOT MUTATE the seq object
    api.getPerValues = function(seq){
        var secsTotal = getTotalSecs(seq);
        var perValues = [];
        var i = 0, len = seq.objects.length;
        while(i < len){
            var per = perValues[i - 1];
            if( per === undefined ){
                perValues.push(0);
            }else{
                var perDelta = seq.objects[i - 1].secs / secsTotal;
                perValues.push( parseFloat( ( per + perDelta ).toFixed(4) ) );         
            }
            i += 1;
        }
        return perValues;
    };
    // get a target frames value
    api.getTargetFrames = function(seq, fps){
        fps = fps === undefined ? 30 : fps;
        var secsTotal = getTotalSecs(seq);
        return Math.ceil(secsTotal * fps);
    };
    // set per values
    api.setPerValues = function(seq, fps){
        // set seq.totalSecs
        seq.totalSecs = getTotalSecs(seq);
        // set per values
        api.getPerValues(seq).forEach(function(per, i){
            seq.objects[i].per = per;
        });
        // set frameMax
        seq.frameMax = api.getTargetFrames(seq, fps);
        return seq;
    };
    // return public api
    return api;
}());