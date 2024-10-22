# HSA12  11. NoSQL Databases: Elasticsearch

## Docker Compose Configuration

This configuration defines two services:

Elasticsearch: Runs an Elasticsearch instance.
Node: Runs a Node.js application that depends on Elasticsearch.

## Setup

1. Launch Docker Compose: To start the services defined in the docker-compose.yml file, run the following command:

````bash
docker-compose up
````

2. API Call for Search: Use the following API call to search for autocomplete suggestions:

````bash
GET /localhost:9200/autocomplete/_search
{
  "suggest": {
    "suggestion": {
      "prefix": "your word",
      "completion": {
        "field": "suggest",
        "fuzzy": {
          "fuzziness": 2
        }
      }
    }
  }
}
 
````

## Recommended Tools
Postman: For testing the API endpoints.

## NOTE
words_alpha_full.txt - a dictionary of words, it can be used, but the initialization time is long