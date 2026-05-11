# Internet-Project

Users:
You can list all users, list a specific user, create, update, and delete a user.
User deletion can only be done if you have the role of admin.

Endpoints:
GET /users
GET /users/1
POST /users
PUT /users/1
DELETE /users/1

Model Types:
Need to add all basic methods for the models (RF, XGBoost)
maybe we need to delete this resource since it will probably have only RF

Endpoints:
GET /model-types
GET /model-types/1

Feature Filters:
Describes what filters were applied (pearson, variance, pca)

Endpoints:
GET /feature-filters
GET /feature-filters/1

Feature Sets:
Need to add all basic methods for the different feature sets (1D, 2D, 3D, 1D+2D, 2D+3D, 1D+3D, All)

Endpoints:
GET /feature-sets
GET /feature-sets/1

Models:
Describes the result of a model training, which feature set was used, which user created it, and the metrics it achieved.

Endpoints:
GET /models