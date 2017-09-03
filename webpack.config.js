module.exports = (webpackConfig) => {
  webpackConfig.output.chunkFilename = '[name].[hash].js';// http://webpack.github.io/docs/configuration.html#output-chunkfilename

  const cssLoaderOption = {
    importLoaders: 1,
    modules: true,
    localIdentName: '[hash:base64:5]',
  };
  const cssLoaders = webpackConfig.module.loaders[3].loader.split('!');
  webpackConfig.module.loaders[3].loader = cssLoaders.map((item) => {
    if (item.startsWith('css')) {
      return `css?${JSON.stringify(cssLoaderOption)}`;
    }
    return item;
  }).join('!');
  webpackConfig.resolve.alias = {
    components: `${__dirname}/src/components`,
    services: `${__dirname}/src/services`,
    utils: `${__dirname}/src/utils`,
    config: `${__dirname}/src/utils/config`,
  };

  webpackConfig.devtool = '#eval'
  return webpackConfig;
};
