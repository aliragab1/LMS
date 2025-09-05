import { requireAdmin } from '@/app/data/admin/require-admin';
import arcjet, { fixedWindow } from '@/lib/arcjet';
import { env } from '@/lib/env';
import { s3 } from '@/lib/s3-client';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const aj = arcjet.withRule(fixedWindow({ mode: 'LIVE', window: '1m', max: 5 }));

export async function DELETE(req: Request) {
  const session = await requireAdmin();
  try {
    const decision = await aj.protect(req, {
      fingerprint: session?.user.id as string,
    });
    if (decision.isDenied()) {
      return NextResponse.json(
        { error: 'You are not allowed to delete files' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const key = body.key;
    if (!key) {
      return NextResponse.json(
        { error: 'Missing or invalid object key' },
        { status: 400 }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    await s3.send(command);
    return NextResponse.json({ message: 'File deleted' }, { status: 200 });
  } catch (error) {
    console.log('DELETE_FILE', error);
    return NextResponse.json(
      { error: 'Failed to delete URL' },
      { status: 500 }
    );
  }
}
