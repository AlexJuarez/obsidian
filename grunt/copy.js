module.exports = {
    dist: {
        files: [{
            expand: true,
            dot: true,
            cwd: 'assets',
            dest: 'dist/assets',
            src: [
                'fixtures/**/*.json',
                '*.{ico,png,txt}',
                '.htaccess',
                'images/**/*.{webp,gif}',
                'fonts/{,*/}*.*'
            ]
        }, {
            expand: true,
            dot: true,
            cwd: 'views',
            dest: 'dist/views/',
            src: '**/*.html'
        }]
    },
    bower: {
        files: [{
            expand: true,
            dot: true,
            cwd: 'assets',
            dest: 'build',
            src: [
                'fonts/{,*/}*.*'
            ]
        }, {
            expand: true,
            dot: true,
            cwd: 'assets/styles',
            dest: 'build',
            src: [
                'mixpo-icons.css'
            ]
        }]
    },
    styles: {
        expand: true,
        dot: true,
        cwd: 'assets/styles',
        dest: 'dist/assets/styles/',
        src: '{,*/}*.css'
    }
};
