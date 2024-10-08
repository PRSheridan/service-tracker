import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function LoginForm({ onLogin }) {
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    username: yup.string().required("Must enter username"),
    password: yup.string().required("Must enter a password"),
  });

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: formSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values, null, 2),
      }).then((response) => {
        setIsLoading(false);
        if (response.ok) {
          navigate("/home");
          response.json().then((user) => onLogin(user));
        } else {
          response.json().then((err) => {
            setErrors(err.error);
          });
        }
      });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    formik.handleSubmit(event);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container-login">
      <div className="form-title-login">Login</div>
      <div className="form-field-login">
        <div className="form-label-login">Username</div>
        <input
          type="text"
          id="username"
          autoComplete="off"
          value={formik.values.username}
          onChange={formik.handleChange}
          className="form-input-login"
        />
        {isSubmitted && <div className="form-error-login">{formik.errors.username}</div>}
      </div>
      <div className="form-field-login">
        <div className="form-label-login">Password</div>
        <input
          type="password"
          id="password"
          autoComplete="off"
          value={formik.values.password}
          onChange={formik.handleChange}
          className="form-input-login"
        />
        {isSubmitted && <div className="form-error-login">{formik.errors.password}</div>}
      </div>
      <div className="button-container-login">
        <button type="submit" className="form-button-login">
          {isLoading ? "Loading..." : "Login"}
        </button>
        {isSubmitted && errors.length > 0 && <div className="form-error-login">{errors}</div>}
      </div>
    </form>
  );
}

export default LoginForm;


  