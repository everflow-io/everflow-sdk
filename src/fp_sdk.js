import Fingerprint2 from 'fingerprintjs2';
import EF from './sdk.js'

const paramsProvider = new Promise((resolve, reject) => {
    setTimeout(function () {
        resolve();
    }, 200);
}).then(() => {
    return new Promise((resolve, reject) => {
        Fingerprint2.get((components) => {
            resolve({
                'effp': Fingerprint2.x64hash128(components.map((component) => component.value).join(''), 31),
            });
        })
    })
})

const globalInstance = new EF(paramsProvider);

export default globalInstance;
