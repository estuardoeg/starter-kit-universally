// This script builds a production output of all of our bundles.

import webpack from 'webpack';
import webpackConfigFactory from '../webpack/configFactory';
import getConfig from '../../config/get';

// First clear the build output dir.
// exec(`rimraf ${pathResolve(appRootDir.get(), getConfig('buildOutputPath'))}`);
// REMOVED, we do this in build script

// Get our "fixed" bundle names
Object.keys(getConfig('bundles'))
// And the "additional" bundle names
.concat(Object.keys(getConfig('additionalNodeBundles')))
// And then build them all.
.forEach((bundleName) => {
  const compiler = webpack(
    webpackConfigFactory({ target: bundleName }),
  );
  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stats.toString({ colors: true }));
  });
});
