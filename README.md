# Continuous Deployment

## CI/CD for Search

Setup CI/CD for your pet project or project based on laradock.

## CI/CD Workflow: GitHub Actions

The CI/CD workflow is defined in the file .github/workflows/docker.yml. Here's a breakdown of the workflow steps:

### 1. Checkout Code:

- The code from the repository is checked out to the runner using the actions/checkout@v2 action.

### 2. Login to Docker Hub:

- Authenticates with Docker Hub using credentials (DOCKER_LOGIN and DOCKER_PASSWORD) stored in GitHub secrets.

### 3. Set up Docker Buildx:

- Configures Docker Buildx for multi-platform builds.

### 4. Install Docker Compose:

- Installs Docker Compose, which is required to build and run multi-container Docker applications.

### 5. Set up Google Cloud Authentication:

- Authenticates the workflow with Google Cloud using the google-github-actions/auth@v2 action. The credentials are
  securely stored as a secret (GCP_SERVICE_ACCOUNT_KEY).

### 6. Set up Google Cloud SDK:

- Configures the Google Cloud SDK required for interacting with Google Cloud services.

### 7. Build and Push Docker Image:

- Builds the Docker image using docker-compose and tags the image with a version (v1.0.3).

- Pushes the built image to Docker Hub.

### 8. Deploy Elasticsearch to Google Cloud Run:

- Deploys the Docker image to Google Cloud Run, configuring it to run with 2Gi memory using the specified region and
  allowing unauthenticated access.

## Workflow Trigger

The workflow triggers on:

- Pushes to the master branch.
- Pull requests targeting the master branch

## Project Structure
- .github/workflows/docker.yml:
Contains the GitHub Actions workflow to build and deploy the Elasticsearch Docker container.

- elasticsearch/Dockerfile:
The Dockerfile that defines how the Elasticsearch container is built.

- setup/add_doc:
A script to add documents to the Elasticsearch index via a curl request.

- setup/autocomplete_settings:
Contains the configuration settings for Elasticsearch, including the autocomplete functionality setup using edge_ngram.

- setup/search:
A script for executing a search query on the Elasticsearch index via curl.

- setup/search_all:
A script for performing a search that matches all documents in the Elasticsearch index.

- docker-compose.yml:
A Docker Compose file used to build and run the Elasticsearch container locally.

## How to Run Locally
To run the project locally:

1. Clone the repository;
2. Build and run the Elasticsearch container:
````bash
docker-compose up --build 
````

3. Interact with the Elasticsearch service: Use the provided scripts in the setup/ folder to interact with Elasticsearch,
such as adding documents and searching the index.

## Deployment
The deployment to Google Cloud Run is automated through the GitHub Actions workflow described above. Every push to the
master branch triggers the build and deployment process, ensuring that the latest changes are always live.