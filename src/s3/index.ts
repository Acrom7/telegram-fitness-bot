import {
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    PutObjectCommandInput,
    S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_ACCESS_KEY_ID, S3_ENDPOINT, S3_SECRET_ACCESS_KEY, S3_REGION, S3_BUCKET_NAME } from '@/const/env';

const s3client = new S3Client({
    credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
    endpoint: S3_ENDPOINT,
    forcePathStyle: true,
    region: S3_REGION,
    apiVersion: 'latest',
});

export function uploadObject(uploadParams: Omit<PutObjectCommandInput, 'Bucket'>) {
    return s3client.send(new PutObjectCommand({
        ...uploadParams,
        Bucket: S3_BUCKET_NAME,
    }));
}

export function getBucketObjects() {
    return s3client.send(new ListObjectsV2Command({
        Bucket: S3_BUCKET_NAME,
    }));
}

export async function getVideoUrl(objectName: string): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: objectName,
        ResponseContentType: 'video/mp4',
    });

    return getSignedUrl(s3client, command, { expiresIn: 3600 });
}
