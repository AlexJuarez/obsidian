module.exports = {
    dist: {
        files: [{
            dot: true,
            src: [
                '.tmp',
                'dist/*',
                '!dist/.git*'
            ]
        }]
    },
    bower: {
        files: [{
            dot: true,
            src: [
                '.tmp',
                'build/*',
                '!build/.git*'
            ]
        }]
    },
    server: ['.tmp']
};
