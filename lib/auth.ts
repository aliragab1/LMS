import { betterAuth } from 'better-auth';
import { emailOTP, admin } from 'better-auth/plugins';

import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './db';
import { env } from './env';
import { resend } from './resend';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // or "mysql", "postgresql", ...etc
  }),

  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },

  // Plugins
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        // Send the OTP for sign in
        await resend.emails.send({
          from: 'MarshalLMS <onboarding@resend.dev>',
          to: [email],
          subject: 'MarshalLMS - Verify your email',
          html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
        });
      },
    }),
    admin(),
  ],
});
