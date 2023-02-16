import S3 from "aws-sdk/clients/s3";
import {AWS} from "../config/settings";
import * as fs from "fs";

const s3 = new S3({
    region: AWS.region,
    accessKeyId: AWS.accessKeyId,
    secretAccessKey: AWS.secretAccessKey
});

class awsService {
    uploadFile(file: any) {
        const fileStream = fs.createReadStream(file.path)

        const uploadParams = {
            Bucket: AWS.bucketName,
            Body: fileStream,
            Key: file.filename
        }

        return s3.upload(uploadParams).promise()
    }

    getFileStream(fileKey: string) {
        const downloadParams = {
            Key: fileKey,
            Bucket: AWS.bucketName
        }

        return s3.getObject(downloadParams).createReadStream()
    }
}

export default new awsService();