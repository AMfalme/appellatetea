import AuthForm from '@/components/auth/AuthForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-24">
      <AuthForm mode="register" />
    </div>
  );
}
