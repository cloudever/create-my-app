module.exports = (api, options = {}) => {
  const {
    ssr,
    flow,
    styled,
    library
  } = options

  // Configure presets
  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: library ? false : 'usage',
        modules: ssr ? 'commonjs' : false,
        targets: ssr ? {
          node: 'current'
        } : (api.env('development') && 'last 2 Chrome versions'),
        ignoreBrowserslistConfig: ssr ? true : api.env('development')
      }
    ],
    [
      '@babel/preset-react',
      {
        development: ssr ? false : api.env('development'),
        useBuiltIns: true
      }
    ]
  ]

  // Configure plugins
  const plugins = [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
    styled && ['babel-plugin-styled-components', {
      minify: api.env('production'),
      pure: true,
      ssr
    }],
    library && ['@babel/plugin-transform-runtime', {
      corejs: 2,
      regenerator: false
    }],
    flow && '@babel/plugin-transform-flow-strip-types',
    api.env('production') && ['babel-plugin-transform-react-remove-prop-types', {
      removeImport: true
    }],
    api.env('development') && 'react-hot-loader/babel'
  ].filter(Boolean)

  return {
    presets,
    plugins
  }
}
