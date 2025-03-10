import { RollupOptions } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import nodeExternals from 'rollup-plugin-node-externals';
import dotenv from "rollup-plugin-dotenv"
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: RollupOptions = {

    input: {
        couch: 'src/couchBot/start.ts',
        manager: 'src/managerBot/start.ts',
    },
    output: {
        dir: 'build/dist',
        format: 'es', // Change format to 'es' for top-level await support
        entryFileNames: 'entry-[name].js',
        sourcemap: true,

    },
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
        }),
        json(),
        nodeResolve({
            preferBuiltins: true,
        }),
        commonjs(),
        alias({
            entries: [
                { find: '@', replacement: path.resolve(__dirname, 'src') },
                { find: '@@', replacement: path.resolve(__dirname) },
                { find: '@manager', replacement: path.resolve(__dirname, 'src/managerBot') },
                { find: '@couch', replacement: path.resolve(__dirname, 'src/couchBot') }
            ],
        }),
        nodeExternals(),
        dotenv()
    ],
    external: [
        // 'path', 'fs', 'url', 'grammy', 'fs/promises',
    ],
};

export default config;
