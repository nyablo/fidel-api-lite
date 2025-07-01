### Local development

```
serverless dev
```

### Deployment

Install dependencies with:

```
npm install
```

and then deploy with:

```
serverless deploy
```

### Invocation

Link an Offer to a Location

```
curl -X POST https://{api-gateway-url}/offers/{offerId}/locations/{locationId}
```
