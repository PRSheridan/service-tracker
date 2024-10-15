import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'

function ModifyPasswordForm() {
  const [errors, setErrors] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = location.state.user

  const formSchema = yup.object().shape({
    password: yup.string().required("Proposed password required"),
    passwordConfirm: yup.string().required("Validate proposed password"),
    passwordCurrent: yup.string().required("Current password required"),
  })

  const formik = useFormik({
    initialValues: {
      password: '',
      passwordConfirm: '',
      passwordCurrent: '',
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch(`/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values, null, 1),
      }).then((response) => {
        if (response.ok) { navigate(`/profile`) } 
        else { response.json().then((err) => setErrors(err.errors)) }
      })
    },
  })

  function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitted(true)
    formik.handleSubmit(event)
  }

  return (
    <div className="new-form">
      <h2>Modify password:</h2>
      <div className="user-field">Current password:</div>
      <input
        type="text"
        id="passwordCurrent"
        autoComplete="off"
        value={formik.values.passwordCurrent}
        onChange={formik.handleChange}
      />
      {isSubmitted && <div className="error">{formik.errors.passwordCurrent}</div>}
      <form onSubmit={handleSubmit}>
        <div className="user-field">Proposed password:</div>
        <input
          type="text"
          id="password"
          autoComplete="off"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {isSubmitted && <div className="error">{formik.errors.password}</div>}
        <div className="user-field">Password Confirmation:</div>
        <input
          type="text"
          id="passwordConfirm"
          autoComplete="off"
          value={formik.values.passwordConfirm}
          onChange={formik.handleChange}
        />
        {isSubmitted && <div className="error">{formik.errors.passwordConfirm}</div>}
        <div className="button-container">
          <button className="button" type="submit">Change password</button>
          <button className="button" onClick={() => navigate(`/profile`)}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default ModifyPasswordForm

