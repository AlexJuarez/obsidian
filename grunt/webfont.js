module.exports = {
    icons: {
        src: 'assets/icons/*.svg',
        dest: 'assets/fonts',
        destCss: 'assets/styles/core',
        options: {
            htmlDemo: true,
            destHtml: 'app/style-guide',
            stylesheet: 'less',
            htmlDemoTemplate: 'assets/icons/template.html',
            template: 'assets/icons/template.less',
            syntax: 'bootstrap',
            relativeFontPath: '/fonts/',
            templateOptions: {
                baseClass: 'glyph-icon',
                classPrefix: 'glyph-',
                mixinPrefix: 'glyph-'
            },
            font: 'mixpo-icons'
        }
    }
}
