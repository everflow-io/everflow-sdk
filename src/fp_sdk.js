import Fingerprint2 from 'fingerprintjs2';
import EF from './sdk.js'

class SDK extends EF {
    constructor() {
        super(new Promise((resolve, reject) => {
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
        }))
    }

    _fetch(key) {
        const name = key + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }

        const rawEntry = window.localStorage.getItem(key);

        if (rawEntry) {
            const entry = JSON.parse(rawEntry);

            const d = new Date();

            if (entry.expiration == null || entry.expiration > d.getTime()) {
                return entry.value;
            }
        }

        return '';
    }

    _persist(key, value, expirationDays = 30) {
        const d = new Date();
        d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));

        document.cookie = `${key}=${value};expires=${d.toUTCString()};path=/`

        const entry = {
            value: value,
            expiration: d.getTime(),
        }

        window.localStorage.setItem(key, JSON.stringify(entry));
    }
}

const globalInstance = new SDK();

export default globalInstance;
