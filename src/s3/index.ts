import { S3Client, ListObjectsV2Command, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

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

export async function findObjectByName(objectName: string) {
    const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: objectName,
    });

    try {
        const response = await s3client.send(command);
        const foundObject = response.Contents?.find((object) => object.Key === objectName);
        return foundObject ?? null;
    } catch (error) {
        console.error('Error finding object:', error);
        throw error;
    }
}
