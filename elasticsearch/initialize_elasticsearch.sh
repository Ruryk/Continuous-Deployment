#!/bin/bash

# Run Elasticsearch in the background
/usr/local/bin/docker-entrypoint.sh &

# Let's wait for Elasticsearch to start
echo "Waiting for Elasticsearch to start..."
until curl -s http://localhost:9200 > /dev/null; do
    sleep 1
done

# Importing data
echo "Elasticsearch is up! Starting data import..."
/usr/share/elasticsearch/import_data.sh

# Prevent the container from stalling
tail -f /dev/null