# Meal Tracker API

## Overview
The Meal Tracker API is a user-centric tool designed to help users manage and track their meals, especially focusing on diet adherence. It allows users to create a profile, record meals, and access various metrics related to their dietary habits.

## Technologies

- Fastify
- Typescript
- Knex
- SQLite
- PostgreSQL
- Vitest
- Zod

## Features

### User Management
- **User Creation**: Allows the creation of a user account.
- **User Identification**: Supports identifying the user between different requests to ensure a personalized experience.

### Meal Management
- **Meal Registration**: Users can register a meal with the following details:
  - **User Association**: Each meal is associated with the user's account.
  - **Name**: The name of the meal.
  - **Description**: A description of the meal.
  - **Date and Time**: When the meal was consumed.
  - **Diet Compliance**: Indicates whether the meal is within the user's diet plan.
- **Editing Meals**: Users can edit all aspects of a registered meal.
- **Deleting Meals**: Allows users to delete their registered meals.
- **Listing Meals**: Users can view a list of all their registered meals.
- **Viewing a Single Meal**: Users can view details of a specific meal.

### Metrics and Analytics
- **Total Meals Registered**: Shows the total number of meals registered by the user.
- **Meals Within the Diet**: Counts how many registered meals adhere to the user's diet.
- **Meals Outside the Diet**: Counts the number of meals that do not adhere to the diet.
- **Best Diet Sequence**: Highlights the longest sequence of consecutive meals within the diet.

### Security and Privacy
- **Ownership Restrictions**: Users can only view, edit, and delete meals that they have created themselves.

## Getting Started

```npm install``` to install dependencies.

```npm run dev``` to start the server in development mode.

```npm run build``` to build the project.

```npm run start``` to start the server in production mode.
