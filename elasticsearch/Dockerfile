FROM elasticsearch:7.17.3

ENV http.port=${PORT}

ENV discovery.type=single-node

# Copy our script and data file to the container
COPY ./import_data.sh /usr/share/elasticsearch/import_data.sh
COPY ./initialize_elasticsearch.sh /usr/share/elasticsearch/initialize_elasticsearch.sh
COPY ./words_alpha.txt /usr/share/elasticsearch/words_alpha.txt

# Making our script executable
RUN chmod +x /usr/share/elasticsearch/import_data.sh
RUN chmod +x /usr/share/elasticsearch/initialize_elasticsearch.sh

# Command to start Elasticsearch and execute the initialization script
CMD [ "sh", "-c", "/usr/local/bin/docker-entrypoint.sh & /usr/share/elasticsearch/initialize_elasticsearch.sh" ]