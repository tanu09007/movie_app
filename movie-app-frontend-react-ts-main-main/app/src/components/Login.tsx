import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage, loginUser } from "./apiService";

interface LoginFormState {
  user_name: string;
  user_password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<LoginFormState>({
    user_name: "",
    user_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { token } = await loginUser(formData);
      localStorage.setItem("token", token);
      navigate("/movielist", { replace: true });
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, "Unable to sign in."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="auth-back" to="/">
          <span aria-hidden="true">←</span> Back to home
        </Link>
        <div className="auth-heading">
          <p className="eyebrow">WELCOME BACK</p>
          <h1>Sign in</h1>
          <p>Pick up where your next movie night begins.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-fields auth-fields-single">
            <div className="auth-field">
              <label htmlFor="user_name">Username</label>
              <input
                type="text"
                name="user_name"
                id="user_name"
                onChange={handleChange}
                value={formData.user_name}
                autoComplete="username"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="pass">Password</label>
              <input
                type="password"
                name="user_password"
                id="pass"
                onChange={handleChange}
                value={formData.user_password}
                autoComplete="current-password"
                required
              />
            </div>
          </div>
          {error && (
            <p className="error-msg" role="alert">
              {error}
            </p>
          )}
          <button
            className="button button-primary auth-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
          <p className="auth-switch">
            New to Movie Club? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Login;
