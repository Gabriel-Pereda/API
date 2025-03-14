const path = require('path');

const rootDir = path.join(__dirname, '..', '..');

module.exports = {
    root: rootDir,
    models: path.join(rootDir, 'src', 'models'),
    controllers: path.join(rootDir, 'src', 'controllers'),
    middleware: path.join(rootDir, 'src', 'middleware'),
    routes: path.join(rootDir, 'routes')
};