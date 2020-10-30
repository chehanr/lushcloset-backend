# LushCloset: API

![CI](https://github.com/matrixnl/lushcloset-backend/workflows/CI/badge.svg)

LushCloset is a service that allows individuals to rent out clothing, footwear, and accessories among each other. \
It should be available on multiple platforms for users to access, namely through web browsers and mobile apps. A highly-available REST API was developed to power these said clients.

## Features

- Create listings to either rent or purchase
- Browse listings by details, geo-location and metadata
- Manage listings that are rented out or awaiting pickup
- Item pickup and drop off verification
- Start chats with users
- ...etc.

## Design Decisions

The API is written in **Express.js** and uses **PostgreSQL** for data persistence.

### Tech Stack

- Docker containers for easier development
- Third-party APIs (Mailgun, Google Maps SDK)
- Backblaze B2 for static file storage
- Airbnb code style enforced by ESLint
- Prettier for code formatting
- Jest and SuperTest as main test frameworks
- GitHub Actions to perform CI/ CD tasks
- Heroku free tier for hosting

## How to Contribute

A comprehensive guide for setting up the project on your local system can be found at the [Wiki](https://github.com/matrixnl/lushcloset-backend/wiki/)
