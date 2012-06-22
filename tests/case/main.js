requirejs.config({
    paths: {
        'camelCase': 'other/camelCase'
    }
});

require(['CamelCase', 'camelCase'], function (CamelCase, camelCase) {
    console.log(CamelCase);
    console.log(camelCase);
});

