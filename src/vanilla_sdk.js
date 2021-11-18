import EF from './sdk.js'

class SDK extends EF {
    constructor() {
        super(Promise.resolve({}))
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
        return '';
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
