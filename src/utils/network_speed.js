import http from 'http';


const CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+`-=[]{}|;':,./<>?";

const generateTestData = sizeInKmb => {
    const iterations = sizeInKmb * 1000;
    let result = '';
    for (let index = 0; index < iterations; index++) {
        result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return result;
}

const calculateSpeed = (fileSizeInBytes, startTime) => {
    const endTime = new Date().getTime();
    const duration = (endTime - startTime) / 1000;
    const bitsLoaded = fileSizeInBytes * 8;
    const bps = (bitsLoaded / duration).toFixed(2);
    const kbps = (bps / 1024).toFixed(2);
    const mbps = (kbps / 1024).toFixed(2);
    return {bps, kbps, mbps};
}

export const downloadSpeedTest = (baseUrl, fileSizeInBytes) => {
    return new Promise((resolve, _) => {
        const startTime = new Date().getTime();
        return http.get(baseUrl, response => {
            response.once('data', () => {});
            response.once('end', () => {
                resolve(calculateSpeed(fileSizeInBytes, startTime));
            });
        });
    }).catch(error => {
        throw new Error(error);
    });
}

export const uploadSpeedTest = (options, fileSizeInBytes = 2000000) => {
    const defaultData = generateTestData(fileSizeInBytes / 1024);
    const data = JSON.stringify({defaultData});
    let startTime;
    return new Promise((resolve, reject) => {
        let req = http.request(options, res => {
            res.setEncoding('utf8');
            res.on('data', () => {});
            res.on('end', () => {
                resolve(calculateSpeed(fileSizeInBytes, startTime));
            });
        });
        startTime = new Date().getTime();
        req.on('error', error => {
            reject(error)
        });
        req.write(data);
        req.end();
    })
}
