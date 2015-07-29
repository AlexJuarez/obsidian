module.exports = {
    options: {
        // Override defaults here
    },
    dev: {
        options: {
            script: 'app.js',
            args: process.argv.slice(2),
            background: true
        }
    },
    prod: {
        options: {
            script: 'app.js',
            node_env: 'production'
        }
    }
};
