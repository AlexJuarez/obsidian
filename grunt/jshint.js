module.exports = {
    options: {
        jshintrc: '.jshintrc'
    },
    all: [
        'Gruntfile.js',
        'app/**/*.js',
        'assets/scripts/**/*.js',
        '!app/components/**/*',
        '!app/vendor/**/*',
        '!assets/scripts/vendor/*'
    ]
};
