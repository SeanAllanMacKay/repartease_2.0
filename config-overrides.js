const { override, fixBabelImports, addLessLoader } = require('customize-cra');
const color = require('./src/styles/color.module')

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': color.primary },
    }),
);