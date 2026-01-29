const webpackConfig = (config) => {
  // Grab the existing rule that handles SVG imports
  const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

  config.module.rules.push(
    // Reapply the existing rule, but only for svg imports ending in ?url
    {
      ...fileLoaderRule,
      test: /\.svg$/i,
      resourceQuery: /url/, // *.svg?url
    },
    // Convert all other *.svg imports to React components
    {
      test: /\.svg$/i,
      issuer: fileLoaderRule.issuer,
      resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
      use: ['@svgr/webpack'],
    }
  );

  // Modify the file loader rule to ignore *.svg, since we have it handled now.
  fileLoaderRule.exclude = /\.svg$/i;

  return config;
};

const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'archdao.fio',
      },
      {
        protocol: 'https',
        hostname: 'docs.archdao.fi',
      },
      {
        protocol: 'https',
        hostname: 'perplexity.ai',
      },
      {
        protocol: 'https',
        hostname: 'laanimaspa.s3.us-east-1.amazonaws.com',
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.ts',
      },
    },
  },
  webpack: process.env.NODE_ENV === 'development' ? undefined : webpackConfig,
};

module.exports = nextConfig;
