import typescript from 'rollup-plugin-typescript';

export default {
    input: './lazeee.ts',
    output: {
        file: 'lazeee.js',
        format: 'iife'
    },
    plugins: [
        typescript()
    ]
};