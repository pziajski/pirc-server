const CryptoJS = require("crypto-js");

const encryptData = (obj) => {
    return {
        data: CryptoJS.AES.encrypt(JSON.stringify(obj), process.env.HASH_KEY).toString()
    }
}

const decryptData = (encryptedStr) => {
    const bytes = CryptoJS.AES.decrypt(encryptedStr, process.env.HASH_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

const encryptValue = (str) => {
    return CryptoJS.AES.encrypt(str, process.env.HASH_KEY).toString();
}

const decryptValue = (encryptedStr) => {
    const bytes = CryptoJS.AES.decrypt(encryptedStr, process.env.HASH_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = { encryptData, decryptData, decryptValue, encryptValue };