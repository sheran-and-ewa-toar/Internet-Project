const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    downloadDataset
} = require("../controllers/downloadController");

router.get(
    "/dataset",
    authMiddleware.isAuthenticated,
    authMiddleware.authorizeRoles([
        "user",
        "manager",
        "admin"
    ]),
    downloadDataset
);

module.exports = router;