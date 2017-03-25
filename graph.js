// creates an ascii bar graph for hastebin.
"use strict";

function Graph (data, options) {
    return new Promise((resolve, reject) => {
        if (!options) options = {}; 
    
        let maxBars = options.maxBars || 32;
        let symbol = options.symbol || "+";
        let title = options.title || "";
        let title2 = title.replace(/./g, "="); // create something to underline the title.
    
        // sorting
        let keys = Object.keys(data);
        if (options.sort) {
            if (options.sort.includes("key")) keys = keys.sort();
            if (options.sort.includes("value")) keys = keys.sort((a, b) => data[b] - data[a]);
            if (options.sort.includes("-reverse")) keys = keys.reverse();
        }
        // loop
        let maxValue = Object.keys(data).map(k => data[k]).sort((a, b) => b - a)[0]; // object.values hack
        let maxKeyLength = keys.map(k => k.length).sort((a, b) => b - a)[0];
        let repeats = keys.length;
        
        let multiple = Math.ceil(maxValue / maxBars) || 1;
        
        let graph = [];
        for (let i = 0; i < repeats; i++) {
            let key = keys[i];
            graph.push(new Array(maxKeyLength - key.length).fill(" ").join("") + key + " |" + new Array(Math.ceil(data[key] / multiple)).fill(symbol).join("") + " [" + data[key] + "]");
        }
        
        resolve((title ? title + "\n" + title2 + "\n\n" : "") + graph.join("\n"));
    });
}

module.exports = Graph;
