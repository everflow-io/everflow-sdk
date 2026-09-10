[![npm (scoped)](https://img.shields.io/npm/v/@everflow/everflow-sdk)](https://www.npmjs.com/package/@everflow/everflow-sdk)

## Usage

Get the latest version of the SDK on npm [here](https://www.npmjs.com/package/@everflow/everflow-sdk).

Configure the SDK before doing any tracking.

```javascript
EF.configure({
    // You only need to set the tracking domain you want to use
    tracking_domain: 'https://<tracking-domain>.com',
})
```

If using the NPM module, the Everflow SDK instance is exported as default.

```javascript
const EverflowSDK = require('@everflow/everflow-sdk');

EverflowSDK.configure({
    // You only need to set the tracking domain you want to use
    tracking_domain: 'https://<tracking-domain>.com',
})
```

## [Documentation](https://developers.everflow.io/docs/everflow-sdk)
Usage directives and examples can be found on our developer hub

## Running locally

To test the SDK locally:

1. **Switch the tracking script to HTTPS.** In the Go repo, open `pkg/event/handler/script.go` and change the scheme:

```go
   // before
   scheme := "http"
   // after
   scheme := "https"
```

2. **Create an `index.html`** file with the tracking script found on the offer, in the Tracking card:

```html
   <!DOCTYPE html>
   <html>
   <body>
       <!-- paste the script from the offer's Tracking card here -->
       <h1>My First Heading</h1>
       <p>My first paragraph.</p>
   </body>
   </html>
```

3. **Serve the file** over HTTP:

```bash
   python3 -m http.server 9001
```

4. **Fire a click** by opening the page with the offer and affiliate IDs:

```
   http://127.0.0.1:9001/index.html?oid=1&affid=7
```
