module.exports = {

    entry: "./entry.jsx",
    output: {
        path: __dirname,
        filename: "bundle.js"
                    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: {}
    },
        module: {
         loaders: [
           { test: /\.css$/, loader: "style!css" },
             { test: /\.jsx$/, loader: 'babel', query: { presets: ['es2015', 'stage-0'] }}
                   ]
             }
};
