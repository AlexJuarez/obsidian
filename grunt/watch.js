module.exports = {
    files: ['views/**/*'],
    options: {
        livereload: 35730
    },
    scripts: {
        files: [
            'app/**/!(*_test).js'
        ]
    },
    html: {
        files: [
            'app/**/*.html'
        ]
    },
    css: {
        files: [
            'assets/styles/**/*.css'
        ]
    },
    less: {
        files: ['assets/styles/**/*.less'],
        tasks: ['less:dev']
    },
    fonts: {
        files: ['assets/icons/*.svg'],
        tasks: ['webfont']
    },
    images: {
        files: [
            'assets/images/**/*.{png,jpg,jpeg,webp}'
        ]
    },
    express: {
        files: ['app.js', 'server/**/*.(js|json)'],
        tasks: ['express:dev'],
        options: {
            spawn: false // Without this option specified express won't be reloaded
        }
    }
}
