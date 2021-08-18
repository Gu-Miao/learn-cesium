const path = require('path')
const CracoLessPlugin = require('craco-less')

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
