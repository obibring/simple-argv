# TSDX Boilerplate

Starting point for build packages that work both in esm and commonjs
environments.

## Getting Started

1. Clone the repo `git clone git@github.com:obibring/tsdx-boilerplate.git`
3. Rename references to `tsdx-boilerplate` from `package.json`.
4. Create the entrypoint file: `src/<your package name>.ts`. __NOTE__: Before this is done, the `build` script will fail since `src/index.ts` is ignored from the build because it is handled by `tsdx`.
5. You're done.
