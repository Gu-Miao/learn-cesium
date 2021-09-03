const path = require('path')
const CracoLessPlugin = require('craco-less')
const CopywebpackPlugin = require('copy-webpack-plugin')

const cesiumSource = path.join(__dirname, 'node_modules/cesium/Source')
const cesiumWorkers = path.join(cesiumSource, '../Build/Cesium/Workers')

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
        new CopywebpackPlugin([{ from: cesiumWorkers, to: 'Workers' }]),
        new CopywebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
        new CopywebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }])
      ]
    },
    configure(config) {
      config.module.unknownContextCritical = false
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
