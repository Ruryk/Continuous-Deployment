#!/bin/bash

# Create an index with the analyzer settings
curl -X PUT "http://localhost:9200/autocomplete" -H 'Content-Type: application/json' -d'
{
  "settings": {
    "analysis": {
      "filter": {
        "autocomplete_filter": {
          "type": "edge_ngram",
          "min_gram": 1,
          "max_gram": 20
        }
      },
      "analyzer": {
        "autocomplete": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "autocomplete_filter"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "suggest": {
        "type": "completion",
        "analyzer": "autocomplete",
        "search_analyzer": "standard"
      }
    }
  }
}'

# Import data from the file words_alpha.txt
while IFS= read -r word; do
  if [ ! -z "$word" ]; then
    curl -X POST "http://localhost:9200/autocomplete/_doc" -H 'Content-Type: application/json' -d'
    {
      "suggest": {
        "input": ["'"$word"'"]
      }
    }'
  fi
done < /usr/share/elasticsearch/words_alpha.txt

echo "Data import completed."
