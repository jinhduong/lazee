import typescript from 'rollup-plugin-typescript';
import { uglify } from 'rollup-plugin-uglify';

export default {
    input: './lazee.ts',
    output: {
        file: process.env.BUILD ? 'dist/lazee.min.js' : 'lazee.js',
        format: 'iife'
    },
    plugins: [
        typescript(),
        process.env.BUILD == 'prod' && uglify()
    ]
};