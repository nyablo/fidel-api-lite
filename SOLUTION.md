# Overview

This solution implements a simplified Offers API using AWS Lambda, DynamoDB, and the Serverless Framework. It enables linking offers to locations for a given brand and maintains a counter of linked locations.

## Assumptions

- Each Offer belongs to one brand (brandId)
- Each Location belongs to one brand (brandId)
- Only locations belonging to the same brand as the offer can be linked
- A location can be linked to multiple offers
- Repeated link attempts do not cause duplicates or `locationsTotal` increment
- High request volume and concurrency are expected
- Data model should support an access pattern for retrieving all the locations linked to an offer

## Data Model

I'ts been decided to implement Adjacency List design pattern, as it's recommended by [AWS](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-adjacency-graphs.html) for **many-to-many** type of relations. In addition this makes retrieval all the locations linked to an offer en easy task (OfferLocations by only the partition key)

### Offers

- `id`: HASH, (partition key)
- `name`: S
- `brandId`: S
- `locationsTotal`: N

### Locations

- `id`: HASH, (partition key)
- `address`: S
- `brandId`: S
- `hasOffer`: B

### OfferLocations

- `offerId`: HASH, (partition key)
- `locationId`: RANGE, (sort key)

## Linking Process (an Offer to a Location)

A Lambda will be implemented to perform the following:

- validate existence of Offer and Location
- ensure same brandId for both entities
- insert the link into OfferLocations table using `attribute_not_exists` - to avoid duplicates
- increment `locationsTotal` if link was newly created
- set `hasOffer` to `true` on the location

## Future Improvements

- auth mechanism to be implemented
- CI/CD + better tests (e2e regression)
- endpoint for "retrieving all the locations linked to an offer" with pagination
- endpoints for other operations on Offers, Locations and their links
- better observability - CW Alerts for anomalies or maybe Datadog or similar
- better project structure
- better validations
- typescript
