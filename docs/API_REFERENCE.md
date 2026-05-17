# API Reference

This document lists all available API endpoints, request formats, example responses, and error responses.

## Base URL

`http://localhost:3000`

## Users

### GET /users
- Description: List all users.
- Query parameters: none
- Request body: none

#### Example success response
```json
[
  {
    "userId": 1,
    "firstName": "Alice",
    "lastName": "Smith",
    "userRole": "user",
    "createDate": "2026-05-17T12:00:00.000Z",
    "updateDate": "2026-05-17T12:00:00.000Z"
  }
]
```

### GET /users/:id
- Description: Get a single user by ID.
- Query parameters: none
- Request body: none

#### Example success response
```json
{
  "userId": 1,
  "firstName": "Alice",
  "lastName": "Smith",
  "userRole": "user",
  "createDate": "2026-05-17T12:00:00.000Z",
  "updateDate": "2026-05-17T12:00:00.000Z"
}
```

#### Example error response
```json
{
  "message": "User not found"
}
```

### POST /users
- Description: Create a new user.
- Query parameters: none
- Request body:
```json
{
  "firstName": "Alice",
  "lastName": "Smith",
  "userRole": "user"
}
```

#### Example success response
```json
{
  "message": "User created successfully",
  "userId": 6
}
```

#### Example error response
```json
{
  "message": "Missing required fields"
}
```

### PUT /users/:id
- Description: Update an existing user.
- Query parameters: none
- Request body:
```json
{
  "firstName": "Alice",
  "lastName": "Jones",
  "userRole": "admin"
}
```

#### Example success response
```json
{
  "message": "User updated successfully",
  "userId": 1
}
```

#### Example error response
```json
{
  "message": "User not found"
}
```

### DELETE /users/:id
- Description: Delete a user.
- Query parameters: none
- Headers:
  - `x-user-role: admin`
- Request body: none

#### Example success response
```json
{
  "message": "User deleted successfully",
  "userId": 1
}
```

#### Example error response
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action",
    "details": {}
  }
}
```

## Model Types

### GET /model-types
- Description: List all model types.
- Query parameters: none
- Request body: none

#### Example success response
```json
{
  "success": true,
  "data": [
    {
      "modelTypeId": 1,
      "name": "Random Forest"
    }
  ],
  "error": null
}
```

### GET /model-types/:id
- Description: Get a model type by ID.
- Query parameters: none
- Request body: none

#### Example success response
```json
{
  "success": true,
  "data": {
    "modelTypeId": 1,
    "name": "Random Forest"
  },
  "error": null
}
```

#### Example error response
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "Model type not found",
    "details": {}
  }
}
```

## Feature Filters

### GET /feature-filters
- Description: List all feature filters.
- Query parameters: none
- Request body: none

#### Example success response
```json
{
  "success": true,
  "data": [
    {
      "filterId": 1,
      "name": "pearson"
    }
  ],
  "error": null
}
```

### GET /feature-filters/:id
- Description: Get a feature filter by ID.
- Query parameters: none
- Request body: none

#### Example success response
```json
{
  "success": true,
  "data": {
    "filterId": 1,
    "name": "pearson"
  },
  "error": null
}
```

#### Example error response
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "Feature filter not found",
    "details": {}
  }
}
```

## Feature Sets

### GET /feature-sets
- Description: List all feature sets.
- Query parameters: none
- Request body: none

#### Example success response
```json
{
  "success": true,
  "data": [
    {
      "featureSetId": 1,
      "name": "1D"
    }
  ],
  "error": null
}
```

### GET /feature-sets/:id
- Description: Get a feature set by ID.
- Query parameters: none
- Request body: none

#### Example success response
```json
{
  "success": true,
  "data": {
    "featureSetId": 1,
    "name": "1D"
  },
  "error": null
}
```

#### Example error response
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "Feature set not found",
    "details": {}
  }
}
```

## Jobs

### GET /jobs
- Description: List all jobs.
- Query parameters: none
- Request body: none

#### Example success response
```json
[
  {
    "jobId": 1,
    "userId": 1,
    "featureSetId": 3,
    "modelTypeId": 1,
    "filterId": 1,
    "accuracy": 0.81,
    "precision": 0.73,
    "recall": 0.78,
    "f1Score": 0.75,
    "cv_mean": 0.8,
    "cv_std": 0.02,
    "createDate": "2026-05-10T12:00:00Z"
  }
]
```

### GET /jobs/:id
- Description: Get one job by ID.
- Query parameters: none
- Request body: none

#### Example success response
```json
{
  "jobId": 1,
  "userId": 1,
  "featureSetId": 3,
  "modelTypeId": 1,
  "filterId": 1,
  "accuracy": 0.81,
  "precision": 0.73,
  "recall": 0.78,
  "f1Score": 0.75,
  "cv_mean": 0.8,
  "cv_std": 0.02,
  "createDate": "2026-05-10T12:00:00Z"
}
```

#### Example error response
```json
{
  "message": "Job not found"
}
```

### POST /jobs
- Description: Create a new job.
- Query parameters: none
- Headers:
  - `x-user-id`: user id of the logged-in user
- Request body:
```json
{
  "featureSetId": 3,
  "modelTypeId": 1,
  "filterId": 2
}
```

#### Example success response
```json
{
  "message": "Job created",
  "jobId": 3
}
```

#### Example error response
```json
{
  "message": "Missing required fields"
}
```

## Notes
- No endpoints currently use query parameters.
- The API is JSON-based for all POST/PUT bodies.
- Use `x-user-role: admin` to delete a user.
- Use `x-user-id: <id>` when creating a job.
