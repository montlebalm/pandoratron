var crypto = require('crypto');
var iv = new Buffer("");

function createCryptor(key) {
    key = new Buffer(key);
    return function encrypt(data) {
        var cipher = crypto.createCipheriv("bf-ecb", key, iv);
        try {
            return Buffer.concat([
                cipher.update(data),
                cipher.final()
            ]);
        } catch (e) {
            return null;
        }
    }
}

function createDecryptor(key) {
    key = new Buffer(key);
    return function decrypt(data) {
        var cipher = crypto.createDecipheriv("bf-ecb", key, iv);
        try {
            return Buffer.concat([
                cipher.update(data),
                cipher.final()
            ]);
        } catch (e) {
            return null;
        }
    }
}

module.exports = {
    e: createCryptor,
    d: createDecryptor
};
