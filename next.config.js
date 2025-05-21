/** @type {import('next').NextConfig} */
const nextConfig = {
  // Nextjs has an issue with pdfjs-dist which optionally uses the canvas package
  // for Node.js compatibility. This causes a "Module parse failed" error when
  // building the app. Since pdfjs-dist is only used on client side, we disable
  // the canvas package for webpack
  // https://github.com/mozilla/pdf.js/issues/16214
  output: 'standalone',
  webpack: (config) => {
    // Setting resolve.alias to false tells webpack to ignore a module
    // https://webpack.js.org/configuration/resolve/#resolvealias
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    // Add support for ESM modules
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx', '.jsx', '.mjs'],
    };
    
    return config;
  },
  
  // Enable transpilation of ESM modules in node_modules 
  // Note: pdfjs-dist is removed from here to avoid conflict with serverExternalPackages
  transpilePackages: ['@react-pdf/renderer'],
  
  // External packages that should be treated as server packages
  serverExternalPackages: ['pdfjs-dist'],
  
  // Configure React 19 and React-DOM 19 compatibility
  reactStrictMode: true
};

module.exports = nextConfig;
