const jsscompress = require("js-string-compression");

const compressString = (str) => {
    const hm = new jsscompress.Hauffman();
    return hm.compress(str);
};

const decompressString = (compressedStr) => {
    const hm = new jsscompress.Hauffman();
    return hm.decompress(compressedStr);
};

module.exports = { compressString, decompressString };