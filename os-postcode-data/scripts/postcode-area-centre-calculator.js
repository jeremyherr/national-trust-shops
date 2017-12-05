const fs = require('fs');

let postcodeLookup = [];

function processFile(resolve, reject, filename, err, csv) {
    if (err) {
        reject(err);
    } else {
        const lines = csv.split('\n');

        let eastingsTotal = 0;
        let northingsTotal = 0;
        let postcodeCount = 0;

        lines.forEach(function(line) {
            if (line.length === 0) { return; }
            const fields = line.split(',');
            const postcode = fields[0];
            eastingsTotal += parseInt(fields[2], 10);
            northingsTotal += parseInt(fields[3], 10);
            postcodeCount += 1;
        });

        const eastingsAverage = eastingsTotal / postcodeCount;
        const northingsAverage = northingsTotal / postcodeCount;

        postcodeLookup[postcodeArea] = {'easting': eastingsAverage, 'northing': northingsAverage};
        resolve(filename.split('.')[0]);
    }
}

function postcodeAreaAverage(postcodeAreaFile) {
    return new Promise(function(resolve, reject) {
        fs.readFile(`data/codepo_gb/Data/CSV/${postcodeAreaFile}`, 'utf8', processFile.bind(null, resolve, reject, postcodeAreaFile));
    });
}


function allAreasAverage() {
    fs.readdir('data/codepo_gb/Data/CSV', 'utf8', function(err, files) {
        if (err) {
            return console.log(err);
        }
        const promises = files.map(file => postcodeAreaAverage(file));

        const promiseAll = Promise.all(promises);

        promiseAll.then(function(values) {
            console.log(postcodeLookup);
        }, function(err) {
            console.log(err);
        });

    });
}

allAreasAverage();