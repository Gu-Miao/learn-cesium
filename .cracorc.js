const path = require('path')
const CracoLessPlugin = require('craco-less')
const CopywebpackPlugin = require('copy-webpack-plugin')

const cesiumSourcePath = 'node_modules/cesium/Source/'
const cesiumBuildPath = 'node_modules/cesium/Build/Cesium/'

const resloveSrc = (...paths) => path.join(__dirname, 'src', ...paths)

module.exports = {
  babel: {
    plugins: [
      ['import', { libraryName: 'antd', style: 'css' }],
      ['@babel/plugin-proposal-decorators', { legacy: true }]
    ]
  },
  webpack: {
    alias: {
      '@': resloveSrc(),
      '@assets': resloveSrc('assets'),
      '@components': resloveSrc('components'),
      '@pages': resloveSrc('pages'),
      '@utils': resloveSrc('utils')
    },
    plugins: {
      add: [
        new CopywebpackPlugin({
          patterns: [
            { from: cesiumSourcePath + 'Assets', to: 'Assets' },
            { from: cesiumSourcePath + 'Widgets', to: 'Widgets' },
            { from: cesiumBuildPath + 'Workers', to: 'Workers' }
          ]
        })
      ]
    },
    configure(config) {
      config.module.unknownContextCritical = false
      config.module.unknownContextRegExp = /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/
      config.module.rules.push({
        test: /\.js$/,
        use: { loader: require.resolve('@open-wc/webpack-import-meta-loader') }
      })
      return config
    }
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {},
            javascriptEnabled: true
          }
        }
      }
    }
  ]
}
