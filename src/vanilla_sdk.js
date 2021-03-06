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

        document.cookie = `${key}=${value};expires=${d.toUTCString()};path=/`
    }
}

const globalInstance = new SDK();

export default globalInstance;
