const engine = require('../util/adapters/storage/S3StorageAdapter');

exports.uploadFile = async (filePath) => {
    return await engine.uploadFile(filePath);
};

// exports.downloadFile = async (filePath) => {
//     return await engine.downloadFile(filePath);
// };
