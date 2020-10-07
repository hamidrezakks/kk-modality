import typescript from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import pkg from './package.json';

const input = './src/index.ts';

const umdGlobals = {
    react: 'React',
};

export default [
    {
        input,
        name: pkg.name,
        output: [
            {
                file: 'playground/src/lib/index.js',
                format: 'esm',
                banner: '/* eslint-disable */',
            },
            {file: pkg.main, format: 'cjs'},
            {file: pkg.module, format: 'esm'},
            {file: pkg.browser, format: 'umd', name: pkg.name, globals: umdGlobals},
        ],
        plugins: [
            del({targets: ['dist/*', 'playground/src/lib']}),
            typescript({
                clean: true,
                typescript: require('typescript'),
                objectHashIgnoreUnknownHack: true,
            }),
            terser(),
        ],
        external: Object.keys(pkg.peerDependencies || {}),
    },
];