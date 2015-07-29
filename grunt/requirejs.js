module.exports = {
    compile: {
        options: {
            baseUrl: 'app',
            mainConfigFile: 'app/main.js',
            generateSourceMaps: true,
            preserveLicenseComments: false,

            optimize: 'uglify2', //none uglify2
            out: 'dist/assets/scripts/app.js',

            findNestedDependencies: true,
            include: ['main'],
            name: 'components/almond/almond'
        }
    },
    core: {
        options: {
            baseUrl: 'app',
            mainConfigFile: 'app/main-core.js',
            optimize: 'none',
            out: 'build/core.js',
            findNestedDependencies: true,
            wrap: true,
            include: ['main-core'],
            name: 'components/almond/almond'
        }
    },
    coremin: {
        options: {
            baseUrl: 'app',
            mainConfigFile: 'app/main-core.js',
            optimize: 'uglify2',
            out: 'build/core.min.js',
            findNestedDependencies: true,
            preserveLicenseComments: false,
            wrap: true,
            generateSourceMaps: true,
            include: ['main-core'],
            name: 'components/almond/almond'
        }
    }
}
