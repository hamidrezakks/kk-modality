import typescript from 'rollup-plugin-typescript2';
import path from 'path';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import del from 'rollup-plugin-delete';
import pkg from './package.json';

const input = './src/index.ts';

const external = id => !id.startsWith('.') && !path.isAbsolute(id);

const babelConfigEsModules = babel({
    runtimeHelpers: true,
    plugins: [['@babel/transform-runtime', {useESModules: true}]],
    sourceMaps: true,
    exclude: 'node_modules/**',
});

const umdGlobals = {
    react: 'React',
};

// export default [
//   {
//     input,
//     name: pkg.name,
//     output: [
//       {
//         file: 'playground/src/lib/index.js',
//         format: 'esm',
//         banner: '/* eslint-disable */',
//       },
//       { file: pkg.main, format: 'cjs' },
//       { file: pkg.module, format: 'esm' },
//       { file: pkg.browser, format: 'umd', name: pkg.name },
//     ],
//     plugins: [
//       del({ targets: ['dist/*', 'playground/src/lib'] }),
//       typescript({
//         typescript: require('typescript'),
//         objectHashIgnoreUnknownHack: true,
//       }),
//     ],
//     external: Object.keys(pkg.peerDependencies || {}),
//   },
// ]
// ;

export default [
    {
        input,
        output: {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
        },
        external,
        plugins: [
            del({targets: ['dist/*', 'playground/src/lib']}),
            babel({
                runtimeHelpers: true,
                plugins: ['@babel/transform-runtime'],
                sourceMaps: true,
            }),
            nodeResolve(),
            commonjs(),
            typescript({
                typescript: require('typescript'),
                objectHashIgnoreUnknownHack: true,
            }),
        ],
    },
    {
        input,
        output: [{
            file: pkg.module,
            format: 'esm',
            sourcemap: true,
        }, {
            file: 'playground/src/lib/index.js',
            format: 'esm',
            banner: '/* eslint-disable */',
        }],
        external,
        plugins: [
            babelConfigEsModules,
            nodeResolve(),
            commonjs(),
            typescript({
                typescript: require('typescript'),
                objectHashIgnoreUnknownHack: true,
            }),
        ],
    },
    {
        input,
        output: {
            file: 'dist/index.umd.js',
            format: 'umd',
            sourcemap: true,
            name: pkg.name,
            globals: umdGlobals,
        },
        external: Object.keys(umdGlobals),
        plugins: [
            babelConfigEsModules,
            nodeResolve(),
            commonjs({
                include: 'node_modules/**',
                // left-hand side can be an absolute path, a path
                // relative to the current directory, or the name
                // of a module in node_modules
                namedExports: {
                    'node_modules/react/index.js': [
                        'cloneElement',
                        'createContext',
                        'Component',
                        'createElement'
                    ],
                    'node_modules/react-dom/index.js': ['render', 'hydrate'],
                    'node_modules/react-is/index.js': [
                        'isElement',
                        'isValidElementType',
                        'ForwardRef',
                        'Memo',
                        'isFragment',
                        'typeOf'
                    ],
                    'node_modules/lodash/lodash.js': [
                        'merge',
                        'clone',
                        'findIndex',
                        'find'
                    ]
                }
            }),
            typescript({
                typescript: require('typescript'),
                objectHashIgnoreUnknownHack: true,
            }),
            terser(),
        ],
    },
];

