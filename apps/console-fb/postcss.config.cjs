const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssPresetEnv = require('postcss-preset-env');
const nesting = require('tailwindcss/nesting');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const config = {
  plugins: [
    // Some plugins, like tailwindcss/nesting, need to run before Tailwind,
    nesting(),
    tailwindcss(),
    //But others, like autoprefixer, need to run after,
    autoprefixer,
    // Then purge CSS files to minimise CSS in production
    !dev &&
      cssnano({
        preset: ['default', { discardComments: { removeAll: true } }],
      }),
    // Use Future CSS Today
    postcssPresetEnv({
      stage: 3,
      features: {
        'nesting-rules': false, // `false` because we are using `tailwindcss/nesting` for this
        'custom-media-queries': true,
        'media-query-ranges': true,
      },
    }),
  ],
};

module.exports = config;
