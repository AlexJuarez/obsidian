module.exports = {
    dist: [
        'requirejs:compile',
        'copy:styles',
        'svgmin',
        'htmlmin'
    ]
};
