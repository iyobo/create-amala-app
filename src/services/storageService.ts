import {
  CreateBucketCommand,
  ListBucketsCommand,
  ListObjectsCommand,
  PutObjectCommand,
  PutObjectRequest,
  S3,
} from '@aws-sdk/client-s3'
import config from '../config/lib/config'

const client = new S3(config.storage.s3)

export class StorageService {
  createFolder = async (folderName: string) => {
    const data = await client.send(
      new CreateBucketCommand({
        Bucket: folderName,
      }),
    )
    console.log('Successfully created folder', data.Location)
    return data
  }

  /**
   * Lists all buckets
   */
  listFolders = async () => {
    const data = await client.send(new ListBucketsCommand({}))
    console.debug('folders', data.Buckets)
    return data
  }

  /**
   * Lists files in a bucket
   */
  listFiles = async (folder: string) => {
    const data = await client.send(
      new ListObjectsCommand({
        Bucket: folder,
      }),
    )
    console.debug('files', data)
    return data
  }

  uploadFile = async (folder: string, fileName: string, body: PutObjectRequest['Body']) => {
    const data = await client.send(
      new PutObjectCommand({
        Bucket: folder,
        Key: fileName,
        Body: body,
      }),
    )

    return data
  }
}

export const storageService = new StorageService()
