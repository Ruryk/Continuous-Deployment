const fs = require('fs');
const { Client } = require('@elastic/elasticsearch');
const readline = require('readline');

const client = new Client({ node: 'http://elasticsearch-service:8080' });

async function checkElasticsearch(maxRetries = 12, delay = 5000) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            await client.ping();
            console.log('Elasticsearch is up!');
            break;
        } catch (error) {
            console.log('Waiting for Elasticsearch...');
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

async function createIndex() {
    await client.indices.create({
        index: 'autocomplete',
        body: {
            settings: {
                analysis: {
                    filter: {
                        autocomplete_filter: {
                            type: 'edge_ngram',
                            min_gram: 1,
                            max_gram: 20
                        }
                    },
                    analyzer: {
                        autocomplete: {
                            type: 'custom',
                            tokenizer: 'standard',
                            filter: [
                                'lowercase',
                                'autocomplete_filter'
                            ]
                        }
                    }
                }
            },
            mappings: {
                properties: {
                    suggest: {
                        type: 'completion',
                        analyzer: 'autocomplete',
                        search_analyzer: 'standard'
                    }
                }
            }
        }
    }, { ignore: [400] }); // Ignore 400 errors (index already exists)
    console.log('Elasticsearch is configured!');
}

async function run() {
    await checkElasticsearch();
    await createIndex();

    const fileStream = fs.createReadStream('words_alpha.txt');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const word = line.trim();
        if (word) {
            await client.index({
                index: 'autocomplete',
                body: {
                    suggest: {
                        input: [word]
                    }
                }
            });
        }
    }

    console.log('Data import completed.');
}

run().catch(console.error);
