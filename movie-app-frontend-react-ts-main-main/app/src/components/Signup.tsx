import React, { useState } from "react";
import axios from "axios";
import { useModal } from "./Checkmodal";
import Modal1 from "./Checkmodal";

import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
interface SignUpFormState {
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  user_password: string;
  phone_no: number | "";
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4001/signup",
        formData
      );
      console.log(formData);
      console.log(response);
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      toggle();
    }
  };
  function handlecancel() {
    toggle();
    navigate("/Login");
  }
  function handleError() {
    toggle();
    navigate("/");
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
                type="number"
                name="phone_no"
                id="phone_no"
                onChange={handleChange}
                value={formData.phone_no}
                required
                maxLength={15}
              />
            </div>
          </div>
          <button className="button button-primary auth-submit" type="submit">
            Create account <span aria-hidden="true">→</span>
          </button>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
      <Modal1 isOpen={isOpen} toggle={toggle}>
        {error ? (
          <>
            <p className="error-msg"> {error}</p>
            <footer>
              <button onClick={handleError}>ok </button>
            </footer>
          </>
        ) : (
          <>
            <p> user signup successfully</p>
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
