# Karta

Karta is a tool designed to help you visualize and manage dependencies across repositories within your project. By mapping connections between services, datasets, endpoints, and other resources, Karta gives teams a comprehensive view of how their codebases interact. This insight is crucial for planning changes, understanding the impact of updates, and maintaining a well-organized, reliable project ecosystem.

## Features

- Dependency Mapping: Karta identifies and maps out dependencies between repositories, revealing how different services, endpoints, and datasets are interconnected.
- Relationship Insights: Discover exactly how your repositories rely on each other—for instance, which repositories are consuming specific APIs or datasets from other repositories.
- Impact Analysis: Get a clear view of what parts of your project might be affected by changes in a specific repository, helping to reduce unexpected issues in dependent systems.
- Interactive Visualization: Visualize the web of dependencies in an intuitive, easy-to-navigate graph that highlights key connections and dependencies at a glance.

## Demo

- [Demo app](https://karta.barbarakogus.com/)

## Requirements

- Node 22+

## Usage

To start using Karta, each repository in your project needs a `.karta.json` file located at the root level. This file defines the dependencies that other projects have on the resources within the repository. Here’s how to set up and configure `.karta.json` to map out these relationships effectively.

Setting Up .karta.json
Create a .karta.json file in the root of each repository where you want to specify dependencies.
Define each dependency as an object within an array in .karta.json. Each object should contain:
who: The name of the repository or project that relies on this resource.
what: The type of dependency (e.g., endpoint, dataset, library).
value: The specific resource being used (e.g., endpoint URL, dataset ID).
Example `.karta.json` File
Here’s an example configuration from an auth repository that lists the dependencies other repositories have on its endpoints:

```json
[
  {
    "who": "bprice",
    "what": "endpoint",
    "value": "/v1/auth"
  },
  {
    "who": "lprice",
    "what": "endpoint",
    "value": "/v1/auth"
  },
  {
    "who": "lprice",
    "what": "endpoint",
    "value": "/v1/me"
  }
]
```

Explanation of the Example
In this example:

The auth repository has two endpoints, `/v1/auth` and `/v1/me`.
The bprice project uses the `/v1/auth` endpoint from the `auth` repository.
The lprice project uses both `/v1/auth` and `/v1/me` endpoints from the `auth` repository.
This setup allows Karta to map these relationships across your project, giving you a clear view of how repositories depend on each other’s resources.

### Adding More Dependencies

To add more dependencies, simply add new objects to the array in .karta.json for each relationship. For instance, if a new project called cprice starts using a new dataset from auth, you could add it like this:

```json
{
  "who": "cprice",
  "what": "dataset",
  "value": "user_data_v2"
}
```

Viewing and Managing Dependencies
After setting up `.karta.json` across repositories, Karta can visualize the dependencies and provide insights into the connections between repositories. This manual approach allows you to easily update or modify dependencies as your project evolves.

### Database Configuration

Karta uses SQLite to store dependency information, with the database.sqlite file generated in the same folder where the application is started. When deploying Karta in Kubernetes, you can persist the database file if you want but usually is unnecessary.

## Getting Started

# Environment Variables

We have some environment variables that need to be passed to make it work:

- DATABASE_LOCATION: Where the database.sqlite is, by default it will be in the same folder that we run the application.
- PRIVATE_TOKEN: The token that has access to read all repos of the organization.
- BASE_GIT_URL: The git url
- GIT_TYPE: Type of git if it's github or gitlab (we only support both for now)
- ORGANIZATION: What is the name of the organization

# Docker

To run in docker, it's important to pass all the environment

```bash
docker run -p 3000:3000 -d -e DATABASE_LOCATION='/app/database.sqlite' -e PRIVATE_TOKEN="your_private_token" -e BASE_GIT_URL="https://api.github.com" -e ORGANIZATION="YourOrganization (ex. KartaRocky)" -e GIT_TYPE="github" ghcr.io/kartarocky/karta:latest
```

# Dev

First thing is to create a .env file in the root of project.
There's an .env.example that you can change.

Install the dependencies:

```bash
npm i
```

Run the application:

```bash
npm run dev
```

If you want to run the cron job that will scan your repos every minute:

```bash
npm run cron
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Prod

You must to run `npm run startWithCron` check in `package.json` what it's doing.
