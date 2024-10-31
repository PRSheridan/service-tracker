import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as yup from "yup"

function SignupForm({ onLogin }) {
  const [errors, setErrors] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate()

  const formSchema = yup.object().shape({
    username: yup.string().required("Must enter username"),
    password: yup.string().required("Must enter a password"),
    passwordConfirm: yup.string().oneOf([yup.ref('password'), null], "Passwords must match"),
    email: yup.string().email("Invalid email").required("Must enter email"),
    phone: yup.number().typeError("Phone must be a number").required("Must enter phone number")
  })

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      passwordConfirm: "",
      email: "",
      phone: ""
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      setIsLoading(true)
      fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values, null, 2),
      }).then((response) => {
        setIsLoading(false)
        if (response.ok) {
          response.json().then((user) => {
            onLogin(user)
            navigate("/home")
          })
        } else {
          response.json().then((err) => setErrors(err.error))
        }
      })
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsSubmitted(true)
    formik.handleSubmit(event)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container-signup">
      <div className="form-title-signup">Signup</div>
      
      <div className="form-field-signup">
        <label htmlFor="username" className="form-label-signup">Username</label>
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
        <label htmlFor="email" className="form-label-signup">Email</label>
        <input
          type="email"
          id="email"
          autoComplete="off"
          value={formik.values.email}
          onChange={formik.handleChange}
          className="form-input-signup"
        />
        {isSubmitted && <div className="form-error-signup">{formik.errors.email}</div>}
      </div>
      
      <div className="form-field-signup">
        <label htmlFor="phone" className="form-label-signup">Phone</label>
        <input
          type="text"
          id="phone"
          autoComplete="off"
          value={formik.values.phone}
          onChange={formik.handleChange}
          className="form-input-signup"
        />
        {isSubmitted && <div className="form-error-signup">{formik.errors.phone}</div>}
      </div>

      <div className="form-field-signup">
        <label htmlFor="password" className="form-label-signup">Password</label>
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
        <label htmlFor="passwordConfirm" className="form-label-signup">Confirm password</label>
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
  )
}

export default SignupForm


