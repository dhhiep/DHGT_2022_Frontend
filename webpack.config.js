const isProduction = process.env.NODE_ENV == 'production';

module.exports = {
  devtool: isProduction ? 'none' : 'eval-cheap-module-source-map',
};
