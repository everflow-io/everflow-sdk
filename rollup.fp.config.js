import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";
import json from "@rollup/plugin-json";

export default {
    input: 'src/fp_sdk.js',
    output: {
        name: 'EF',
        file: path.join(process.env.GOPATH, 'src', 'everflow.io', 'pkg', 'event', 'template', 'asset', 'everflow-fp-sdk.js'),
        format: 'iife',
        globals: {
            'url': 'URL'
        }
    },
    plugins: [
        resolve({
            browser: true,
            preferBuiltins: true
        }),
        commonjs(),
        babel({
            babelrc: false,
            presets: [['@babel/preset-env', { modules: false }]],
            exclude: 'node_modules/**'
        }),
        json({compact: true}),
        uglify(),
    ],
    external: ['url']
}