const { success, error } = require('../utils/responseHelpers');
const { User, Job, JobFilter, sequelize } = require('../models');
const { Op } = require('sequelize');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(success(users));
    } catch (err) {
        return res.status(500).json(error('INTERNAL_ERROR', 'Failed to retrieve users: ' + err.message));
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json(error('NOT_FOUND', 'User profile not found.'));
        }

        return res.status(200).json(success(user));
    } catch (err) {
        return res.status(500).json(error('INTERNAL_ERROR', err.message));
    }
};

const getUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json(error('NOT_FOUND', 'User record not found.'));
        }

        return res.status(200).json(success(user));
    } catch (err) {
        return res.status(500).json(error('INTERNAL_ERROR', err.message));
    }
};

const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const normalizedPassword = String(password ?? '');

        if (normalizedPassword.trim().length < 6) {
            return res.status(400).json(error('VALIDATION_ERROR', 'Password must be at least 6 characters.'));
        }

        const existingUser = await User.findOne({
            where: {
                email: { [Op.like]: email.trim().toLowerCase() }
            }
        });

        if (existingUser) {
            return res.status(409).json(error("USER_EXISTS", "Email already registered."));
        }

        const newUser = await User.create({
            firstName,
            lastName,
            email: email.trim().toLowerCase(),
            password: normalizedPassword,
            userRole: "user",
            theme: "light",
            createDate: new Date(),
            updateDate: new Date()
        });

        return res.status(201).json(
            success({
                message: "User created successfully",
                userId: newUser.userId
            })
        );
    } catch (err) {
        return res.status(500).json(error("INTERNAL_ERROR", "Failed to create user row: " + err.message));
    }
};

const updateUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json(error('NOT_FOUND', 'User record not found.'));
        }

        const requesterRole = req.userRole;
        const requesterId = req.userId;

        if (!requesterRole || !requesterId) {
            return res.status(401).json(error('UNAUTHENTICATED', 'Authentication required.'));
        }

        // Authorization checks
        const isSelf = requesterId === id;
        const isAdmin = requesterRole === 'admin';
        const isManager = requesterRole === 'manager';

        if (!isSelf && !isAdmin && !isManager) {
            return res.status(403).json(
                error('FORBIDDEN', 'You do not have permission to modify this user account.')
            );
        }

        const { firstName, lastName, email, password, userRole, theme } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validThemes = ['light', 'dark', 'pink', 'teal'];
        const normalizedPassword = password === undefined ? undefined : String(password);

        if (email !== undefined && !emailRegex.test(email)) {
            return res.status(400).json(error('VALIDATION_ERROR', 'Invalid email format.'));
        }

        if (normalizedPassword !== undefined && normalizedPassword.length > 0 && normalizedPassword.length < 6) {
            return res.status(400).json(error('VALIDATION_ERROR', 'Password must be at least 6 characters.'));
        }

        if (theme !== undefined && !validThemes.includes(theme)) {
            return res.status(400).json(error('VALIDATION_ERROR', 'Invalid theme chosen.'));
        }

        const updateFields = {};
        if (firstName !== undefined) updateFields.firstName = firstName;
        if (lastName !== undefined) updateFields.lastName = lastName;
        if (email !== undefined) updateFields.email = email.trim().toLowerCase();
        if (normalizedPassword?.trim()) updateFields.password = normalizedPassword;
        if (theme !== undefined) updateFields.theme = theme;

        if ((isAdmin || isManager) && userRole !== undefined) {
            updateFields.userRole = userRole;
        }

        updateFields.updateDate = new Date();

        await user.update(updateFields);

        return res.status(200).json(
            success({
                message: 'User updated successfully',
                userId: id
            })
        );
    } catch (err) {
        return res.status(500).json(error('INTERNAL_ERROR', 'Update workflow failure: ' + err.message));
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json(
                error(
                    "NOT_FOUND",
                    "User record not found."
                )
            );
        }

        const isSelf =
            req.userId === id;

        const isAdmin =
            req.userRole === "admin";

        if (!isSelf && !isAdmin) {
            return res.status(403).json(
                error(
                    "FORBIDDEN",
                    "You do not have permission to delete this account."
                )
            );
        }

        if (isAdmin && isSelf) {
            return res.status(400).json(
                error(
                    "INVALID_ACTION",
                    "Admins cannot delete their own account from administration panel."
                )
            );
        }        

        await sequelize.transaction(
            async (t) => {

                const jobs =
                    await Job.findAll({
                        where: {
                            userId: id
                        },
                        attributes: ["jobId"],
                        transaction: t
                    });

                const jobIds =
                    jobs.map(
                        j => j.jobId
                    );

                if (jobIds.length > 0) {

                    await JobFilter.destroy({
                        where: {
                            jobId: jobIds
                        },
                        transaction: t
                    });

                    await Job.destroy({
                        where: {
                            userId: id
                        },
                        transaction: t
                    });
                }

                await User.destroy({
                    where: {
                        userId: id
                    },
                    transaction: t
                });
            }
        );

        return res.status(200).json(
            success({
                message:
                    "User deleted successfully",
                userId: id
            })
        );

    } catch (err) {
        return res.status(500).json(
            error(
                "INTERNAL_ERROR",
                err.message
            )
        );
    }
};

module.exports = {
    getAllUsers,
    getCurrentUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};