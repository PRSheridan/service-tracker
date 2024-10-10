import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function SignupForm({ onLogin }) {
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    username: yup.string().required("Must enter username"),
    password: yup.string().required("Must enter a password"),
    passwordConfirm: yup.string().oneOf([yup.ref('password'), null], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: { username: "", password: "", passwordConfirm: "" },
    validationSchema: formSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values, null, 2),
      }).then((response) => {
        setIsLoading(false);
        if (response.ok) {
          navigate("/home");
          response.json().then((user) => onLogin(user));
        } else {
          response.json().then((err) => setErrors(err.error));
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
    <form onSubmit={handleSubmit} className="form-container-signup">
      <div className="form-title-signup">Signup</div>
      <div className="form-field-signup">
        <div className="form-label-signup">Username</div>
        <input
          type="text"
          id="username"
          autoComplete="off"
          value={formik.values.username}
          onChange={formik.handleChange}
          className="form-input-signup"
        />
        {isSubmitted && <div className="form-error-signup">{formik.errors.username}</div>}
      </div>
      <div className="form-field-signup">
        <div className="form-label-signup">Password</div>
        <input
          type="password"
          id="password"
          autoComplete="off"
          value={formik.values.password}
          onChange={formik.handleChange}
          className="form-input-signup"
        />
        {isSubmitted && <div className="form-error-signup">{formik.errors.password}</div>}
      </div>
      <div className="form-field-signup">
        <div className="form-label-signup">Confirm password</div>
        <input
          type="password"
          id="passwordConfirm"
          autoComplete="off"
          value={formik.values.passwordConfirm}
          onChange={formik.handleChange}
          className="form-input-signup"
        />
        {isSubmitted && <div className="form-error-signup">{formik.errors.passwordConfirm}</div>}
      </div>
      <div className="button-container-signup">
        <button type="submit" className="form-button-signup">
          {isLoading ? "Loading..." : "Create account"}
        </button>
        {isSubmitted && errors.length > 0 && <div className="form-error-signup">{errors}</div>}
      </div>
    </form>
  );
}

export default SignupForm;

