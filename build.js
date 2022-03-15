require('esbuild').build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/app.js',
  platform: 'node',
  external: ['./node_modules/*'],
  sourcemap: true,
  minify: false
}).catch(() => process.exit(1));