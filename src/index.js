import 'whatwg-fetch';
import 'url-polyfill';

import Fingerprint2 from 'fingerprintjs2';

class EF {
    constructor() {
        this._fingerprintingReady = new Promise((resolve, reject) => {
            if (window.requestIdleCallback) {
                requestIdleCallback(function () {
                    resolve();
                });
            } else {
                setTimeout(function () {
                    resolve();
                }, 100);
            }
        })
        this._trackingDomain = '<<.TrackingDomain>>';
    }

    configure(options) {
        this._trackingDomain = options.tracking_domain;
    }

    click(options) {
        if (!options.offer_id) {
            console.warn(`Unable to track. Missing "offer_id" parameter.`)
            return;
        }

        this._fingerprintingReady.then(() => {
            Fingerprint2.get((components) => {
                var murmur = Fingerprint2.x64hash128(components.map((component) => component.value).join(''), 31)

                console.log(murmur.length);

                const url = new URL(`${this._trackingDomain}/clk`)

                const queryParams = new URLSearchParams(url.search);

                queryParams.set('effp', murmur || '');
                queryParams.set('transaction_id', options.transaction_id || '');
                queryParams.set('oid', options.offer_id);
                queryParams.set('affid', options.affiliate_id || '');
                queryParams.set('async', 'json')

                if (options.sub1) {
                    queryParams.set('sub1', options.sub1)
                }

                if (options.sub2) {
                    queryParams.set('sub2', options.sub2)
                }

                if (options.sub3) {
                    queryParams.set('sub3', options.sub3)
                }

                if (options.sub4) {
                    queryParams.set('sub4', options.sub4)
                }

                if (options.sub5) {
                    queryParams.set('sub5', options.sub5)
                }

                if (options.source_id) {
                    queryParams.set('source_id', options.source_id)
                }

                if (options.disable_fingerprinting) {
                    queryParams.delete('effp');
                }

                url.search = queryParams.toString();

                fetch(url.toString())
                    .then((response) => response.json(),
                        (error) => {
                            console.log(error);
                        })
                    .then((response) => {
                        console.log(response);

                        if (response.transaction_id && response.transaction_id.length > 0) {
                            this._persist(`ef_tid_${options.offer_id}`, response.transaction_id);
                        }
                    })
            })
        });
    }

    conversion(options) {
        if (!options.transaction_id) {
            options.transaction_id = this._fetch(`ef_tid_${options.offer_id}`);
        }

        this._fingerprintingReady.then(() => {
            Fingerprint2.get((components) => {
                var murmur = Fingerprint2.x64hash128(components.map((component) => component.value).join(''), 31)

                const url = new URL(`${this._trackingDomain}`)

                const queryParams = new URLSearchParams(url.search);

                queryParams.set('effp', murmur || '');
                queryParams.set('transaction_id', options.transaction_id || '');
                queryParams.set('oid', options.offer_id);
                queryParams.set('affid', options.affiliate_id || '');
                queryParams.set('event_id', options.event_id || 0);
                queryParams.set('coupon_code', options.coupon_code || '');
                queryParams.set('amount', options.amount || '');

                if (options.adv1) {
                    queryParams.set('adv1', options.adv1)
                }

                if (options.adv2) {
                    queryParams.set('adv2', options.adv2)
                }

                if (options.adv3) {
                    queryParams.set('adv3', options.adv3)
                }

                if (options.adv4) {
                    queryParams.set('adv4', options.adv4)
                }

                if (options.adv5) {
                    queryParams.set('adv5', options.adv5)
                }

                if (options.disable_fingerprinting) {
                    queryParams.delete('effp');
                }

                url.search = queryParams.toString();

                const script = document.createElement('iframe');
                script.width = 1;
                script.height = 1;
                script.frameBorder = 0;
                script.src = url.toString();

                document.getElementsByTagName('body')[0].appendChild(script);
            })
        });
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

            if (entry.expiration > d.getTime()) {
                return entry.value;
            }
        }

        return '';
    }

    _persist(key, value, expirationDays) {
        const d = new Date();
        d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));

        document.cookie = `${key}=${value};expires=${d.toUTCString()};path=/`

        const entry = {
            value: value,
            expiration: d.getTime(),
        }

        window.localStorage.setItem(key, JSON.stringify(entry));
    }

    urlParameter(name) {
        return new URL(window.location.href).searchParams.get(name);
    }
}

const globalInstance = new EF();

export default globalInstance;