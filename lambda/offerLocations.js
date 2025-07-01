const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const express = require("express");
const serverless = require("serverless-http");

const app = express();

const { LOCATIONS_TABLE, OFFERS_TABLE, OFFER_LOCATIONS_TABLE } = process.env;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

exports.link = async (event) => {
  // url parsing can be done in a better way
  const pathParts = event.path.split("/");
  const offerIdIndex = pathParts.indexOf("offers") + 1;
  const locationIdIndex = pathParts.indexOf("locations") + 1;
  const offerId = pathParts[offerIdIndex];
  const locationId = pathParts[locationIdIndex];

  const getOfferCommand = new GetCommand({
    TableName: OFFERS_TABLE,
    Key: {
      offerId: offerId,
    },
  });
  const offer = await docClient.send(getOfferCommand);
  if (!offer.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Offer not found" }),
    };
  }

  const getLocationCommand = new GetCommand({
    TableName: LOCATIONS_TABLE,
    Key: {
      locationId: locationId,
    },
  });
  const location = await docClient.send(getLocationCommand);
  if (!location.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Location not found" }),
    };
  }

  if (offer.Item.brandId !== location.Item.brandId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Offer and Location must belong to the same brand",
      }),
    };
  }

  const putCommand = new PutCommand({
    TableName: OFFER_LOCATIONS_TABLE,
    Item: {
      offerId: offerId,
      locationId: locationId,
    },
    ConditionExpression:
      "attribute_not_exists(offerId) AND attribute_not_exists(locationId)",
  });

  try {
    await docClient.send(putCommand);
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 409,
        body: JSON.stringify({
          error: "Offer is already linked to this location",
        }),
      };
    }
    throw err;
  }

  const updateOfferCommand = new UpdateCommand({
    TableName: OFFERS_TABLE,
    Key: { offerId: offerId },
    UpdateExpression:
      "SET locationsTotal = if_not_exists(locationsTotal, :zero) + :inc",
    ExpressionAttributeValues: {
      ":inc": 1,
      ":zero": 0,
    },
  });
  await docClient.send(updateOfferCommand);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Offer linked to location successfully" }),
  };
};
