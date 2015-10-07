module.exports = {
    options: {
        // Override defaults here
    },
    dev: {
        options: {
            script: 'app.js',
            args: process.argv.slice(2)
        }
    },
    prod: {
        options: {
            script: 'app.js',
            args: process.argv.slice(2),
            node_env: 'production'
        }
    }
};
