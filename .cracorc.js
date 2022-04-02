const path = require('path')
const CracoLessPlugin = require('craco-less')
const CopywebpackPlugin = require('copy-webpack-plugin')

const cesiumSourcePath = 'node_modules/cesium/Source/'
const cesiumBuildPath = 'node_modules/cesium/Build/Cesium/'

const resloveSrc = (...paths) => path.join(__dirname, 'src', ...paths)

module.exports = {
  webpack: {
    alias: {
      '@': resloveSrc()
    },
    plugins: {
      add: [
        new CopywebpackPlugin({
          patterns: [
            { from: cesiumSourcePath + 'Assets', to: 'Assets' },
            { from: cesiumSourcePath + 'Widgets', to: 'Widgets' },
            { from: cesiumBuildPath + 'Workers', to: 'Workers' },
            { from: cesiumBuildPath + 'ThirdParty', to: 'ThirdParty' }
          ]
        })
      ]
    },
    configure(config) {
      config.module.unknownContextCritical = false
      config.module.unknownContextRegExp = /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/

      const oneOfRules = config.module.rules.find(rule => rule.oneOf)
      oneOfRules.oneOf.unshift({
        test: /\.glsl$/,
        use: [{ loader: require.resolve('raw-loader'), options: { esModule: false } }]
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
