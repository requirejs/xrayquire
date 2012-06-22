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
        var oldLoad = context.load;

        context.load = function (id, url) {
            var lowerId = id.toLowerCase(),
                mixedCases = getX(context).mixedCases;

            if (mixedCases[lowerId]) {
                console.error('Mixed case modules may conflict: ' + mixedCases[lowerId] + ' vs. ' + id);
            } else {
                mixedCases[lowerId] = id;
            }

            return oldLoad.apply(context, arguments);
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
        var xray = getX(context),
            id = map.id;

        if (typeof context.defined[id] === 'undefined') {
            //May be a problem with a circular dependency.
            //console.error(id + ' has undefined module value, may be part of a bad circular reference');
        }

        xray.traced[id] = {
            map: map,
            deps: deps
        };
    };


}());