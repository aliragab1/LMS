import { Suspense } from 'react';
import { VerifyRequestForm } from './_components/verify-request-form';

const VerifyRequestPage = () => {
  return (
    <Suspense>
      <VerifyRequestForm />
    </Suspense>
  );
};
export default VerifyRequestPage;
