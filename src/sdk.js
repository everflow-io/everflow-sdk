import 'whatwg-fetch';
import 'url-polyfill';

export default class EverflowSDK {
    constructor(customParamProvider) {
        this.customParamProvider = customParamProvider;
        this._trackingDomain = '<<.TrackingDomain>>';
    }

    configure(options) {
        this._trackingDomain = options.tracking_domain;
    }

    getTransactionId(offerId) {
        return this._fetch(`ef_tid_${offerId}`)
    }

    impression(options) {
        if (!options.offer_id) {
            console.warn(`Unable to track. Missing "offer_id" parameter.`)
            return Promise.resolve("");
        }

        if (options.do_not_track === true) {
            return Promise.resolve("");
        }

        return new Promise((resolve, reject) => {
            this.customParamProvider.then((customParams) => {
                const url = new URL(`${this._trackingDomain}/imp`)

                const queryParams = new URLSearchParams(url.search);

                for (const k in customParams) {
                    if (customParams.hasOwnProperty(k)) {
                        queryParams.set(k, customParams[k])
                    }
                }

                queryParams.set('oid', options.offer_id);
                queryParams.set('affid', options.affiliate_id || '');
                queryParams.set('async', 'json')

                if (this._isDefined(options.sub1)) {
                    queryParams.set('sub1', options.sub1)
                }

                if (this._isDefined(options.sub2)) {
                    queryParams.set('sub2', options.sub2)
                }

                if (this._isDefined(options.sub3)) {
                    queryParams.set('sub3', options.sub3)
                }

                if (this._isDefined(options.sub4)) {
                    queryParams.set('sub4', options.sub4)
                }

                if (this._isDefined(options.sub5)) {
                    queryParams.set('sub5', options.sub5)
                }

                if (this._isDefined(options.adv1)) {
                    queryParams.set('adv1', options.adv1)
                }

                if (this._isDefined(options.adv2)) {
                    queryParams.set('adv2', options.adv2)
                }

                if (this._isDefined(options.adv3)) {
                    queryParams.set('adv3', options.adv3)
                }

                if (this._isDefined(options.adv4)) {
                    queryParams.set('adv4', options.adv4)
                }

                if (this._isDefined(options.adv5)) {
                    queryParams.set('adv5', options.adv5)
                }

                if (this._isDefined(options.source_id)) {
                    queryParams.set('source_id', options.source_id)
                }

                if (options.disable_fingerprinting === true) {
                    queryParams.delete('effp');
                }

                url.search = queryParams.toString();

                fetch(url.toString(), {
                    method: 'GET',
                    credentials: 'include'
                })
                    .then((response) => response.json(),
                        (error) => {
                            console.error(error);
                            resolve("")
                        })
                    .then((response) => {
                        if (response.transaction_id && response.transaction_id.length > 0) {
                            this._persist(`ef_tid_${options.offer_id}`, response.transaction_id);
                            resolve(response.transaction_id);
                        }
                    })
            });
        });
    }

    click(options) {
        if (!options.offer_id && !options.transaction_id) {
            console.warn(`Unable to track. Missing "offer_id" or "transaction_id" parameter.`)
            return Promise.resolve("");
        }

        if (options.do_not_track === true) {
            return Promise.resolve("");
        }

        return new Promise((resolve, reject) => {
            this.customParamProvider.then((customParams) => {
                const url = new URL(`${this._trackingDomain}/clk`)

                const queryParams = new URLSearchParams(url.search);

                for (const k in customParams) {
                    if (customParams.hasOwnProperty(k)) {
                        queryParams.set(k, customParams[k])
                    }
                }

                queryParams.set('_ef_transaction_id', options.transaction_id || '');
                queryParams.set('oid', options.offer_id || '');
                queryParams.set('affid', options.affiliate_id || '');
                queryParams.set('async', 'json')

                if (this._isDefined(options.uid)) {
                    queryParams.set('uid', options.uid)
                }

                if (this._isDefined(options.sub1)) {
                    queryParams.set('sub1', options.sub1)
                }

                if (this._isDefined(options.sub2)) {
                    queryParams.set('sub2', options.sub2)
                }

                if (this._isDefined(options.sub3)) {
                    queryParams.set('sub3', options.sub3)
                }

                if (this._isDefined(options.sub4)) {
                    queryParams.set('sub4', options.sub4)
                }

                if (this._isDefined(options.sub5)) {
                    queryParams.set('sub5', options.sub5)
                }

                if (this._isDefined(options.adv1)) {
                    queryParams.set('adv1', options.adv1)
                }

                if (this._isDefined(options.adv2)) {
                    queryParams.set('adv2', options.adv2)
                }

                if (this._isDefined(options.adv3)) {
                    queryParams.set('adv3', options.adv3)
                }

                if (this._isDefined(options.adv4)) {
                    queryParams.set('adv4', options.adv4)
                }

                if (this._isDefined(options.adv5)) {
                    queryParams.set('adv5', options.adv5)
                }

                if (this._isDefined(options.source_id)) {
                    queryParams.set('source_id', options.source_id)
                }

                if (options.disable_fingerprinting === true) {
                    queryParams.delete('effp');
                }

                url.search = queryParams.toString();

                fetch(url.toString(), {
                    method: 'GET',
                    credentials: 'include'
                })
                    .then((response) => response.json(),
                        (error) => {
                            console.error(error);
                            resolve("");
                        })
                    .then((response) => {
                        if (response.transaction_id && response.transaction_id.length > 0) {
                            this._persist(`ef_tid_${options.offer_id}`, response.transaction_id);
                            resolve(response.transaction_id);
                        }
                    })
            });
        });
    }

    conversion(options) {
        if (!options.transaction_id) {
            options.transaction_id = this._fetch(`ef_tid_${options.offer_id}`);
        }

        return new Promise((resolve, reject) => {
            this.customParamProvider.then((customParams) => {
                const url = new URL(`${this._trackingDomain}`)

                const queryParams = new URLSearchParams(url.search);

                for (const k in customParams) {
                    if (customParams.hasOwnProperty(k)) {
                        queryParams.set(k, customParams[k])
                    }
                }

                queryParams.set('transaction_id', options.transaction_id || '');
                queryParams.set('event_id', options.event_id || 0);

                if (this._isDefined(options.offer_id)) {
                    queryParams.set('oid', options.offer_id);
                }

                if (this._isDefined(options.affiliate_id)) {
                    queryParams.set('affid', options.affiliate_id);
                }

                if (this._isDefined(options.advertiser_id)) {
                    queryParams.set('advid', options.advertiser_id);
                }

                if (this._isDefined(options.aid)) {
                    queryParams.set('aid', options.aid);
                }

                if (this._isDefined(options.adv_event_id)) {
                    queryParams.set('adv_event_id', options.adv_event_id);
                    queryParams.delete('event_id');
                }

                if (this._isDefined(options.coupon_code)) {
                    queryParams.set('coupon_code', options.coupon_code);
                }

                if (this._isDefined(options.amount)) {
                    queryParams.set('amount', options.amount);
                }

                if (this._isDefined(options.adv1)) {
                    queryParams.set('adv1', options.adv1)
                }

                if (this._isDefined(options.adv2)) {
                    queryParams.set('adv2', options.adv2)
                }

                if (this._isDefined(options.adv3)) {
                    queryParams.set('adv3', options.adv3)
                }

                if (this._isDefined(options.adv4)) {
                    queryParams.set('adv4', options.adv4)
                }

                if (this._isDefined(options.adv5)) {
                    queryParams.set('adv5', options.adv5)
                }

                if (this._isDefined(options.sub1)) {
                    queryParams.set('sub1', options.sub1)
                }

                if (this._isDefined(options.sub2)) {
                    queryParams.set('sub2', options.sub2)
                }

                if (this._isDefined(options.sub3)) {
                    queryParams.set('sub3', options.sub3)
                }

                if (this._isDefined(options.sub4)) {
                    queryParams.set('sub4', options.sub4)
                }

                if (this._isDefined(options.sub5)) {
                    queryParams.set('sub5', options.sub5)
                }

                if (this._isDefined(options.order_id)) {
                    queryParams.set('order_id', options.order_id)
                }

                if (this._isDefined(options.order)) {
                    queryParams.set('order', JSON.stringify(options.order));
                }

                if (options.disable_fingerprinting === true) {
                    queryParams.delete('effp');
                }

                if (this._isDefined(options.parameters)) {
                    Object.keys(options.parameters).forEach(p => queryParams.set(p, options.parameters[p]));
                }

                url.search = queryParams.toString();

                fetch(url.toString(), {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            return { conversion_id: '', transaction_id: '', html_pixel: '' };
                        }
                    })
                    .then((response) => {
                        if (response.html_pixel != '') {
                            const script = document.createElement('iframe');
                            script.width = 1;
                            script.height = 1;
                            script.frameBorder = 0;

                            document.getElementsByTagName('body')[0].appendChild(script);

                            script.contentWindow.document.open();
                            script.contentWindow.document.write(response.html_pixel);
                            script.contentWindow.document.close();
                        }
                        resolve({ transaction_id: response.transaction_id, conversion_id: response.conversion_id });
                    })
                    .catch((err) => {
                        console.log(err);
                        resolve({ conversion_id: '', transaction_id: '', html_pixel: '' });
                    })
            });
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

            if (entry.expiration == null || entry.expiration > d.getTime()) {
                return entry.value;
            }
        }

        return '';
    }

    _isDefined(value) {
        return typeof value !== 'undefined';
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

    urlParameter(name) {
        return new URL(window.location.href).searchParams.get(name);
    }
}