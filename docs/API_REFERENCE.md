# API Reference

This document lists all available API endpoints, request formats, example responses, and error responses.

## Base URL

`http://localhost:3000`

## Response format

Successful responses use the envelope:
```json
{
  "success": true,
  "data": ..., 
  "error": null
}
```

Error responses use the envelope:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "...",
    "message": "...",
    "details": {}
  }
}
```

## Users

### GET /users
- Description: List all users.
- Query parameters: none
- Headers: none
- Request body: none

#### Example success response
```json
{
  "success": true,
  "data": [
    {
      "userId": 1,
      "firstName": "Ewa",
      "lastName": "Yo",
      "userRole": "admin",
      "createDate": "2026-05-10T12:00:00Z",
      "updateDate": "2026-05-10T12:00:00Z"
    }
  ],
  "error": null
}
```

### GET /users/:id
- Description: Get a single user by ID.
- Query parameters: none
- Headers: none
- Request body: none

#### Example success response
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "firstName": "Ewa",
    "lastName": "Yo",
    "userRole": "admin",
    "createDate": "2026-05-10T12:00:00Z",
    "updateDate": "2026-05-10T12:00:00Z"
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
    "message": "User not found",
    "details": {}
  }
}
```

### POST /users
- Description: Create a new user.
- Query parameters: none
- Headers: none
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
  "success": true,
  "data": {
    "message": "User created successfully",
    "userId": 6
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
    "code": "VALIDATION_ERROR",
    "message": "Missing required request body fields.",
    "details": {
      "missingFields": ["firstName"]
    }
  }
}
```

### PUT /users/:id
- Description: Update an existing user.
- Query parameters: none
- Headers:
  - `x-user-id`: required
  - `x-user-role`: required
- Request body:
```json
{
  "firstName": "Alice",
  "lastName": "Jones",
  "userRole": "admin"
}
```
- Notes:
  - A regular `user` may update only their own record and cannot change `userRole`.
  - A `manager` or `admin` may update any user and may change `userRole`.

#### Example success response
```json
{
  "success": true,
  "data": {
    "message": "User updated successfully",
    "userId": 1
  },
  "error": null
}
```

#### Example error response (missing fields)
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing required request body fields.",
    "details": {
      "missingFields": ["firstName"]
    }
  }
}
```

#### Example error response (forbidden)
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action.",
    "details": {}
  }
}
```

### DELETE /users/:id
- Description: Delete a user.
- Query parameters: none
- Headers:
  - `x-user-id`: required
  - `x-user-role: admin`
- Request body: none

#### Example success response
```json
{
  "success": true,
  "data": {
    "message": "User deleted successfully",
    "userId": 1
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
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action.",
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
- Description: List jobs.
- Query parameters: none
- Headers:
  - `x-user-role`: `user`, `manager`, or `admin`
  - `x-user-id`: required when `x-user-role` is `user`
- Request body: none

#### Example success response
```json
{
  "success": true,
  "data": [
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
  ],
  "error": null
}
```

### GET /jobs/:id
- Description: Get a job by ID.
- Query parameters: none
- Headers:
  - `x-user-role`: `user`, `manager`, or `admin`
  - `x-user-id`: required when `x-user-role` is `user`
- Request body: none

#### Example success response
```json
{
  "success": true,
  "data": {
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
    "message": "Job not found",
    "details": {}
  }
}
```

### POST /jobs
- Description: Create a new job.
- Query parameters: none
- Headers:
  - `x-user-id`: numeric ID of the current user
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
  "success": true,
  "data": {
    "message": "Job created",
    "jobId": 3
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
    "code": "VALIDATION_ERROR",
    "message": "Missing required request body fields.",
    "details": {
      "missingFields": ["featureSetId"]
    }
  }
}
```

### PUT /jobs/:job_id
- Description: Update job metadata.
- Query parameters: none
- Headers:
  - `x-user-id`: required
  - `x-user-role`: `manager` or `admin`
- Request body:
```json
{
  "title": "New job title",
  "notes": "Updated notes"
}
```

#### Example success response
```json
{
  "success": true,
  "data": {
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
    "createDate": "2026-05-10T12:00:00Z",
    "title": "New job title",
    "notes": "Updated notes",
    "updateDate": "2026-05-30T00:00:00Z"
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
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action.",
    "details": {}
  }
}
```

### DELETE /jobs/:job_id
- Description: Delete a training job.
- Query parameters: none
- Headers:
  - `x-user-id`: required
  - `x-user-role: admin`
- Request body: none

#### Example success response
```json
{
  "success": true,
  "data": {
    "message": "Job deleted successfully",
    "jobId": 1
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
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action.",
    "details": {}
  }
}
```

## Notes
- No endpoints use query parameters.
- All POST and PUT bodies must be JSON.
- Use `x-user-id` to indicate the current user for authenticated actions.
- Use `x-user-role` to simulate RBAC.
- A `user` may only see their own jobs and may only update their own user record.
- `manager` and `admin` can update jobs.
- `admin` is required to delete jobs and users.
