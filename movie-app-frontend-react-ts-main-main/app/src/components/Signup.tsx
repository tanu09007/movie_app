import React, { useState } from "react";
import { useModal } from "./Checkmodal";
import Modal1 from "./Checkmodal";

import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage, signupUser } from "./apiService";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
interface SignUpFormState {
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  user_password: string;
  phone_no: string;
}
// type UserSubmitForm = {
//   first_name: string;
//   last_name: string;
//   user_name: string;
//   email: string;
//   user_password: string;
//   phone_no: number;
// };
const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, toggle } = useModal();

  const [formData, setFormData] = useState<SignUpFormState>({
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    user_password: "",
    phone_no: "",
  });

  // const validationSchema = Yup.object().shape({
  //   first_name: Yup.string().required("Fullname is required"),
  //   last_name: Yup.string()
  //     .required("Username is required")
  //     .min(6, "Username must be at least 6 characters")
  //     .max(20, "Username must not exceed 20 characters"),
  //     user_name: Yup.string()
  //     .required("Username is required")
  //     .min(6, "Username must be at least 6 characters")
  //     .max(20, "Username must not exceed 20 characters"),
  //   email: Yup.string().required("Email is required").email("Email is invalid"),
  //   user_password: Yup.string()
  //     .required("Password is required")
  //     .min(6, "Password must be at least 6 characters")
  //     .max(40, "Password must not exceed 40 characters"),
  //     phone_no: Yup.number()
  //     .required("phone_no is required")
  // });

  //  const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<UserSubmitForm>({
  //   resolver: yupResolver(validationSchema),
  // });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await signupUser(formData);
      setIsSuccess(true);
    } catch (error: unknown) {
      setIsSuccess(false);
      setError(getApiErrorMessage(error, "Unable to create account."));
    } finally {
      setIsSubmitting(false);
      toggle();
    }
  };
  function handlecancel() {
    toggle();
    navigate("/login");
  }
  function handleError() {
    toggle();
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="auth-back" to="/">
          <span aria-hidden="true">←</span> Back to home
        </Link>
        <div className="auth-heading">
          <p className="eyebrow">WELCOME TO MOVIE CLUB</p>
          <h1>Create your account</h1>
          <p>Save your favorites and find your next great watch.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-fields">
            <div className="auth-field">
              <label htmlFor="fname">First name</label>
              <input
                type="text"
                name="first_name"
                id="fname"
                onChange={handleChange}
                value={formData.first_name}
                required
                maxLength={20}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="lname">Last name</label>
              <input
                type="text"
                name="last_name"
                id="lname"
                onChange={handleChange}
                value={formData.last_name}
                required
                maxLength={20}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="user_name">Username</label>
              <input
                type="text"
                name="user_name"
                id="user_name"
                onChange={handleChange}
                value={formData.user_name}
                required
                maxLength={20}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                value={formData.email}
                required
                maxLength={40}
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
                required
                maxLength={15}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="phone_no">Phone number</label>
              <input
                type="tel"
                name="phone_no"
                id="phone_no"
                onChange={handleChange}
                value={formData.phone_no}
                required
                maxLength={15}
                minLength={7}
                pattern="[0-9]{7,15}"
                autoComplete="tel"
              />
            </div>
          </div>
          <button
            className="button button-primary auth-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
            {!isSubmitting && <span aria-hidden="true">→</span>}
          </button>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
      <Modal1 isOpen={isOpen} toggle={toggle}>
        {!isSuccess ? (
          <>
            <p className="error-msg"> {error}</p>
            <footer>
              <button onClick={handleError}>ok </button>
            </footer>
          </>
        ) : (
          <>
            <p>Account created. You can now sign in.</p>
            <footer>
              <button onClick={handlecancel}>ok </button>
            </footer>
          </>
        )}
      </Modal1>
    </main>
  );
};

export default Signup;
