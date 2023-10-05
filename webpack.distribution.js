const path = require('path');
 
// here we use the plugins to clear folders and copy folder content
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 
module.exports = {
    entry: {
 
        // this is our entry point, the main JavaScript file
        app: './src/main.ts',
    },
    output: {
 
        // this is our output file, the one which bundles all libraries
        filename: 'main.js',
 
        // and this is the path of the output bundle, "dist" folder
        path: path.resolve(__dirname, 'dist'),
    },
 
    // we are in production mode
    mode: 'production',
    plugins: [
 
        // here we clean the destination folder
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
 
        // here we copy some files to destination folder.
        new CopyPlugin({
            patterns: [
                { 
                    // src/index.html
                    from: 'index.html',
                    context: 'src/'
                },
                { 
                    // website specific
                    from: 'landing.html',
                    context: 'src/'
                },
                { 
                    from: 'pilottest.html',
                    context: 'src/'
                },
                { 
                    from: 'pilottestHolder.html',
                    context: 'src/'
                },
                { 
                    from: 'elements.html',
                    context: 'src/'
                },
                { 
                    from: 'generic.html',
                    context: 'src/'
                },
                { 
                    from: 'fonts.css',
                    context: 'src/'
                },
                { 
                    from: 'assets/browser/css/*',
                    context: 'src/'
                },
                { 
                    from: 'assets/audio/*',
                    context: 'src/'
                },
                { 
                    from: 'assets/browser/images/*',
                    context: 'src/'
                },
                { 
                    from: 'assets/images/Backgrounds/*',
                    context: 'src/'
                },
                { 
                    from: 'assets/images/Buttons/*',
                    context: 'src/'
                },
                { 
                    from: 'assets/images/Gifs/*',
                    context: 'src/'
                },
                { 
                    from: 'assets/browser/js/*',
                    context: 'src/'
                },
                { 
                    from: 'assets/browser/sass/*',
                    context: 'src/'
                },
                { 
                    from: 'assets/browser/webfonts/*',
                    context: 'src/'
                },
                {
                    from: 'assets/images/*',
                    context: 'src/'
                },
                {
                    from: 'assets/fonts/*',
                    context: 'src/'
                }
            ]
        })
    ],
    
    // list of extensions to resolve, in resolve order
    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ]
    },
 
    // loader to handle TypeScript file type
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    }
};