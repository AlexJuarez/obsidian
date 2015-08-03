module.exports = {
    options: {
        dirs: ['dist/assets'],
        basedir: 'dist/assets'
    },
    html: ['dist/assets/{,*/}*.html', 'dist/views/**/*.html'],
    css: ['dist/assets/styles/{,*/}*.css']
};
