const express = require('express');
const fs = require('fs');
const { Client } = require('@elastic/elasticsearch');
const readline = require('readline');

const port = process.env.PORT || 8080;

const client = new Client({ node: `elasticsearch-service:${ port }` });

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

async function importData() {
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

async function initializeElasticsearch() {
    try {
        await checkElasticsearch();
        await createIndex();
        await importData();
    } catch (error) {
        console.error('Error initializing Elasticsearch:', error);
    }
}

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Hello, World!</h1>');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    initializeElasticsearch();
});
