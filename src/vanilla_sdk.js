import EF from './sdk.js'

class SDK extends EF {
    constructor() {
        super(Promise.resolve({}))
    }

    _fetch(key) {
        const cookies = document.cookie
            .split(';')
            .map(v => v.split('='))
            .reduce((acc, v) => {
                try {
                    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                }
                catch (e) { }
                return acc;
            }, {});

        return cookies[key] ? cookies[key].trim() : '';
    }

    _persist(key, value, expirationDays = 30) {
        const d = new Date();
        d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));

        if (value.length > 1650) {
            value = value.substring(0, 33) + value.substring(value.length - 1616, value.length);
        }

        if (this._tld) {
            document.cookie = `${key}=${value};expires=${d.toUTCString()};path=/;domain=${this._tld}`
        } else {
            document.cookie = `${key}=${value};expires=${d.toUTCString()};path=/`
        }
    }
}

const globalInstance = new SDK();

export default globalInstance;
