module.exports = {
  resolver: {
    extraNodeModules: require('node-libs-browser'),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
