module.exports = {
    dev: {
        options: {
            paths: ['assets/styles/less']
        },
        files: {
            'assets/styles/screen.css': 'assets/styles/less/screen.less',
            'assets/styles/core.css': 'assets/styles/core/core.less'
        }
    },
    bower: {
        options: {
            paths: ['assets/styles/less'],
            plugins: [
                new (require('less-plugin-autoprefix'))({browsers: ['last 2 versions']}),
                new (require('less-plugin-clean-css'))()
            ]
        },
        files: {
            'build/core.css': 'assets/styles/core/core.less'
        }
    },
    dist: {
        options: {
            paths: ['assets/styles/less'],
            plugins: [
                new (require('less-plugin-autoprefix'))({browsers: ['last 2 versions']}),
                new (require('less-plugin-clean-css'))()
            ]
        },
        files: {
            'assets/styles/screen.css': 'assets/styles/less/screen.less',
            'assets/styles/core.css': 'assets/styles/core/core.less'
        }
    }
}
