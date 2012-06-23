/**
 * @license xrayquire 0.0.0 Copyright (c) 2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/xrayquire for details
 */
/*jslint  */
/*global requirejs, xrayquire, console */

/**
 * Put a script tag in the HTML that references this script right after the
 * script tag for require.js.
 */

(function () {
    'use strict';

    var contexts = {},
        config = typeof xrayquire === 'undefined' ? {} : xrayquire,
        s = requirejs.s,
        oldNewContext = s.newContext,
        prop;

    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    function formatId(id) {
        //If the ID is for a require call, make it prettier.
        return id.indexOf('_@r') === 0 ? 'require()' : id;
    }

    function getX(context) {
        if (!context.xray) {
            context.xray = {
                traced: {},
                mixedCases: {}
            };
        }
        return context.xray;
    }

    function modContext(context) {
        var oldLoad = context.load,
            modProto = context.Module.prototype,
            oldModuleEnable = modProto.enable;


        modProto.enable = function () {
            var result = oldModuleEnable.apply(this, arguments),
                xray = getX(context),
                traced = xray.traced,
                mixedCases = xray.mixedCases,
                id = this.map.id;

            //Cycle through the dependencies now, wire this up here
            //instead of context.load so that we get a recording of
            //modules as they are encountered, and not as they
            //are fetched/loaded, since things could fall over between
            //now and then.
            if (!traced[id]) {
                each(this.depMaps, function (dep) {
                    var depId = dep.id,
                        lowerId = depId.toLowerCase();

                    if (mixedCases[lowerId]) {
                        console.error('Mixed case modules may conflict: ' +
                                        formatId(mixedCases[lowerId].refId) +
                                        ' asked for: "' +
                                        mixedCases[lowerId].id +
                                        '" and ' +
                                        formatId(id) +
                                        ' asked for: "' +
                                        depId +
                                        '"');
                    } else {
                        mixedCases[lowerId] = {
                            refId: id,
                            id: depId
                        };
                    }
                });

                traced[id] = {
                    map: this.map,
                    deps: this.deps
                };
            }

            return result;
        };

        return context;
    }

    //Mod any existing contexts.
    for (prop in requirejs.s.contexts) {
        if (s.contexts.hasOwnProperty(prop)) {
            modContext(s.contexts[prop]);
        }
    }
    //Apply mods to any new context.
    s.newContext = function (name) {
        return modContext(oldNewContext);
    };


    requirejs.onResourceLoad = function (context, map, deps) {
        var id = map.id;

        if (typeof context.defined[id] === 'undefined') {
            //May be a problem with a circular dependency.
            //console.error(id + ' has undefined module value, may be part ' +
            //              'of a bad circular reference');
        }
    };

}());