import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function LoginForm({ onLogin }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
          navigate("/Home");
          response.json().then((user) => onLogin(user));
        } else {
          response.json().then((err) => {
            setErrors(err.error);
          });
        }
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>Login</div>
      <div>
        <div>Username</div>
        <input
          type="text"
          id="username"
          autoComplete="off"
          value={formik.values.username}
          onChange={formik.handleChange}
        />
        <a style={{ color: "red" }}>{formik.errors.username}</a>
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
        <a style={{ color: "red" }}>{formik.errors.password}</a>
      </div>
      <div>
        <button type="submit">{isLoading ? "Loading..." : "Login"}</button>
        {errors.length > 1 ? <div>{errors}</div> : <></>}
      </div>
    </form>
  );
}

export default LoginForm;