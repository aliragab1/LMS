import { env } from '@/lib/env';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { s3 } from '@/lib/s3-client';
import arcjet, { fixedWindow } from '@/lib/arcjet';
import { requireAdmin } from '@/app/data/admin/require-admin';

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: 'File name is required' }),
  contentType: z.string().min(1, { message: 'Content type is required' }),
  size: z.number().min(1, { message: 'Size is required' }),
  isImage: z.boolean(),
});

const aj = arcjet.withRule(fixedWindow({ mode: 'LIVE', window: '1m', max: 5 }));

export async function POST(req: Request) {
  const session = await requireAdmin();
  try {
    const decision = await aj.protect(req, {
      fingerprint: session?.user.id as string,
    });

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: 'You are not allowed to upload files' },
        { status: 429 }
      );
    }

    const body = await req.json();

    const validation = fileUploadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { fileName, contentType, size } = validation.data;

    const uniqueKey = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      ContentType: contentType,
      ContentLength: size,
      Key: uniqueKey,
    });

    const presignedUrl = await getSignedUrl(s3, command, {
      expiresIn: 360, // URL expires in 6min
    });

    const res = { presignedUrl, key: uniqueKey };
    return NextResponse.json(res);
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    );
  }
}
