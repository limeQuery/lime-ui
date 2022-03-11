
const presets = [
  [
    "@babel/preset-env",
    {
      targets: process.env.NODE_ENV === 'production'
        ? "> 0.25%, not dead"
        : { browsers: "last 1 versions, > 5%, not dead, not ie 11" },
      useBuiltIns: "usage",
      debug: true,
      corejs: "3.20",
    },
  ],
  [
    "@babel/preset-react",
    { runtime: "automatic" }
  ]
];

const plugins = [
  [
    "@babel/plugin-transform-runtime",
    { "corejs": 3, }
  ]
]

module.exports = { presets, plugins };