import AuthCard from "../authComponents/AuthCard";
import SignupForm from "../authFeatures/SignupForm";
import './authPage.css'
function SignupPage() {
  return (
    <div className="auth-page">
      <AuthCard>
        <h1>Sign up</h1>
        <SignupForm />
      </AuthCard>
    </div>
  );
}

export default SignupPage;