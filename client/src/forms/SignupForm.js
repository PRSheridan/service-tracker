import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function SignupForm({ onLogin }) {
  const [errors, setErrors] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

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

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>Signup</div>
      <div>
        <div>Username</div>
        <input
          type="text"
          id="username"   
          autoComplete="off"
          value={formik.values.username}
          onChange={formik.handleChange}
        />
        <div style={{ color: "red" }}>{formik.errors.username}</div>
      </div>
      <div>
        <div>Password</div>
        <input
          type="password"
          id="password"
          autoComplete="off"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        <div style={{ color: "red" }}>{formik.errors.password}</div>
      </div>
      <div>
        <div>Confirm password</div>
        <input
          type="password"
          id="passwordConfirm"
          autoComplete="off"
          value={formik.values.passwordConfirm}
          onChange={formik.handleChange}
        />
        <div style={{ color: "red" }}>{formik.errors.passwordConfirm}</div>
      </div>
      <div>
        <button type="submit">{isLoading ? "Loading..." : "Create account"}</button>
        {errors.length > 0 && <div>{errors}</div>}
      </div>
    </form>
  );
}

export default SignupForm;
