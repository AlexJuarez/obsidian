module.exports = {
    dist: {
        files: [{
            expand: true,
            cwd: 'assets/images',
            src: '{,*/}*.svg',
            dest: 'dist/assets/images'
        }]
    }
};
