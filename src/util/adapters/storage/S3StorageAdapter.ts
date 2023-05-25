import { chance } from '../../crypto'

import s3 from 's3'
import config from '../../../config/lib/config'

const client = s3.createClient(config.storage.s3)

exports.uploadFile = async (filePath) => {
  const s3Path = chance.guid()
  const uploader = client.uploadFile({
    localFile: filePath,

    s3Params: {
      // Bucket: "s3 bucket name",
      Key: s3Path,
      // other options supported by putObject, except Body and ContentLength.
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    },
  })
  return await new Promise((resolve, reject) => {
    uploader.on('error', function (err) {
      reject(err)
    })
    // uploader.on('progress', function () {
    //     console.log("progress", uploader.progressMd5Amount,
    //         uploader.progressAmount, uploader.progressTotal);
    // });
    uploader.on('end', function () {
      resolve(`${config.storage.s3.s3Options.endpoint}/${s3Path}`)
    })
  })
}
