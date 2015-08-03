module.exports = {
    dist: {
        files: [{
            expand: true,
            cwd: 'assets/images',
            src: '**/*.{png,jpg,jpeg}',
            dest: 'dist/assets/images'
        }]
    }
};
