import { SignupForm } from "../components/auth/signup-form";

const SignUpPage = () => {
  return (
    <div className="app-surface flex min-h-svh flex-col items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-5xl">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignUpPage;
