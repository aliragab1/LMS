'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { authClient } from '@/lib/auth-client';
import { Loader } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export const VerifyRequestForm = () => {
  const [otp, setOtp] = useState('');
  const [otpPending, startOtpTransition] = useTransition();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') as string;

  const isOtpComleted = otp.length === 6;

  const router = useRouter();

  const verifyOtp = () => {
    startOtpTransition(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: async () => {
            toast.success('Email verified successfully');
            router.push('/');
            await authClient.revokeOtherSessions();
          },
          onError: () => {
            toast.error('Error verifying email');
          },
        },
      });
    });
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please check your email</CardTitle>
        <CardDescription>
          We have sent a verification email code to your email address. Please
          check your inbox and enter the OTP code below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-muted-foreground text-sm">
            Enter the 6-digits code sent to your email
          </p>
        </div>
        <Button
          type="button"
          onClick={verifyOtp}
          disabled={!isOtpComleted || otpPending}
          className="w-full"
        >
          {otpPending ? (
            <>
              <Loader className="animate-spin size-4" />
              <span>Loading...</span>
            </>
          ) : (
            <span>Verify Account</span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
