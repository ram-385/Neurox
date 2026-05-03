import Card from "../authComponents/AuthCard";
import LoginForm from "../authFeatures/LoginForm";
import './authPage.css'
function LoginPage() {
  return (
    <div className="auth-page">
      <Card>
        <h1>Login</h1>
        <LoginForm />
      </Card>
    </div>
  );
}

export default LoginPage;