import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: './index.ts',
    output: {
        file: 'bin/ss',
        format: 'umd'
    },
    plugins: [
        nodeResolve({
            jsnext: true,
            main: true
        }),

        commonjs({
            include: /node_modules/
        })
    ]

}