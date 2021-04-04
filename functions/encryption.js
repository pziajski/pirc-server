const CryptoJS = require("crypto-js");

const encryptData = (obj) => {
    return {
        data: CryptoJS.AES.encrypt(JSON.stringify(obj), process.env.HASH_KEY).toString()
    }
}

const decryptData = (str) => {
    const bytes = CryptoJS.AES.decrypt(str, process.env.HASH_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

module.exports = { encryptData, decryptData };