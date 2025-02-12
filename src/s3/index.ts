import {
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    PutObjectCommandInput,
    S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const bucketName = process.env.S3_BUCKET_NAME;

const s3client = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
    },
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
    region: process.env.S3_REGION,
    apiVersion: 'latest',
});

export function uploadObject(uploadParams: Omit<PutObjectCommandInput, 'Bucket'>) {
    return s3client.send(new PutObjectCommand({
        ...uploadParams,
        Bucket: bucketName,
    }));
}

export function getBucketObjects() {
    return s3client.send(new ListObjectsV2Command({
        Bucket: bucketName,
    }));
}

export async function getVideoUrl(objectName: string): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectName,
        ResponseContentType: 'video/mp4',
    });

    return getSignedUrl(s3client, command, { expiresIn: 3600 });
}
