const crypto = require('crypto');

const HASH_ITERATIONS = 120000;
const HASH_KEY_LENGTH = 64;
const HASH_DIGEST = 'sha512';
const HASH_PREFIX = 'pbkdf2';
const HASH_SALT_LENGTH = 32;
const HASH_VALUE_LENGTH = 128;

const isPasswordHash = (value) => {
    if (typeof value !== 'string') {
        return false;
    }

    const parts = value.split('$');
    return (
        parts.length === 3 &&
        parts[0] === HASH_PREFIX &&
        parts[1].length === HASH_SALT_LENGTH &&
        parts[2].length === HASH_VALUE_LENGTH
    );
};

const hashPassword = (password) => {
    const normalizedPassword = String(password);
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto
        .pbkdf2Sync(normalizedPassword, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_DIGEST)
        .toString('hex');

    return `${HASH_PREFIX}$${salt}$${derivedKey}`;
};

const verifyPassword = (password, storedPassword) => {
    if (typeof password !== 'string' || !isPasswordHash(storedPassword)) {
        return false;
    }

    const normalizedPassword = String(password);
    const [, salt, storedHash] = storedPassword.split('$');
    const derivedKey = crypto
        .pbkdf2Sync(normalizedPassword, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_DIGEST)
        .toString('hex');

    return crypto.timingSafeEqual(Buffer.from(derivedKey, 'hex'), Buffer.from(storedHash, 'hex'));
};

module.exports = {
    hashPassword,
    isPasswordHash,
    verifyPassword
};