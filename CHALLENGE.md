# Coding Challenge

## About this challenge

This challenge focuses on RESTful API and data model design. It is composed of two parts for which you should present a single solution.

We recommend that you write up a few short paragraphs explaining the decisions you made during the implementation of your solution, as well as any missing improvement steps to become a production-ready project. Each part also includes a set of questions that you should answer in order to be able to discuss them in future stages.

Any questions you may have please contact.

# Context

This test's main goal is to create a simplified version of the Offers API platform, which allows customers to connect brands (ex: Starbucks) to offers.

_Example: Add 5% cashback offer to Starbucks Oxford street location_

Feel free to browse our docs to familiarise yourself with our current [commercial offering](https://docs.fidel.uk/offers).

When implementing your solution, you should take high request volume and concurrency into consideration. **The solution must also be deployable, testable, and include test automation**.

It is expected your solution to use the below technologies:

- AWS platform as provider,
- Lambda,
- DynamoDB,
- Deployment tool (we recommend the serverless framework),

## Documentation

Documentation is key. Please use **SOLUTION.md** to write the answers to the below questions and anything else you think we should know.

It may include things like assumptions, decisions, diagrams, deployment instructions, etc.

## Part 1

Create a DynamoDB data model and insert the following simplified data into it:

Offers

```json
[
  {
    "name": "Super Duper Offer",
    "id": "d9b1d9ff-543e-47c7-895f-87f71dcad91b",
    "brandId": "692126c8-6e72-4ad7-8a73-25fc2f1f56e4",
    "locationsTotal": 0
  }
]
```

Locations

```json
[
  {
    "id": "03665f6d-27e2-4e69-aa9b-5b39d03e5f59",
    "address": "Address 1",
    "brandId": "692126c8-6e72-4ad7-8a73-25fc2f1f56e4",
    "hasOffer": false
  },
  {
    "id": "706ef281-e00f-4288-9a84-973aeb29636e",
    "address": "Address 2",
    "brandId": "692126c8-6e72-4ad7-8a73-25fc2f1f56e4",
    "hasOffer": false
  },
  {
    "id": "1c7a27de-4bbd-4d63-a5ec-2eae5a0f1870",
    "address": "Address 3",
    "brandId": "692126c8-6e72-4ad7-8a73-25fc2f1f56e4",
    "hasOffer": false
  }
]
```

## Part 2

Create a Lambda function with an API endpoint that allows for the linking of a location to an offer. The function should also increase the `locationsTotal` counter of the offer and mark the location with `hasOffer: true`. When developing your solution, take into consideration the following aspects:

Client can link the location 5th Avenue, London to an offer of 10% discount on Starbucks.

- The client can also link the same location to an offer of 20% discount on Starbucks
- The data model should support an access pattern for retrieving all the locations linked to an offer (the implementation of the endpoint is not required)
