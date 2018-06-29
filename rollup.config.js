import typescript from 'rollup-plugin-typescript';
import { uglify } from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/lazee.ts',
    output: {
        file: process.env.BUILD ? 'dist/lazee.min.js' : 'src/lazee.js',
        format: 'iife'
    },
    plugins: [
        typescript(),
        // babel({
        //     babelrc: false,
        //     presets: [['es2015', { modules: false }]]
        // }),
        process.env.BUILD == 'prod' && uglify()
    ]
};