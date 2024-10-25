import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'

function ModifyUserForm() {
  const [errors, setErrors] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const user = location.state.user

  const formSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    phone: yup.string().nullable(),
  })

  const formik = useFormik({
    initialValues: {
      username: user.username,
      email: user.email,
      phone: user.phone,
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

  return (
    <div className="new-form">
      <h2>Modify account details:</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="user-field">Username:</div>
        <input
          type="text"
          id="username"
          autoComplete="off"
          value={formik.values.username}
          onChange={formik.handleChange}
        />
        <div className="error">{formik.errors.username}</div>

        <div className="user-field">Email:</div>
        <input
          type="email"
          id="email"
          autoComplete="off"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        <div className="error">{formik.errors.email}</div>

        <div className="user-field">Phone:</div>
        <input
          type="text"
          id="phone"
          autoComplete="off"
          value={formik.values.phone}
          onChange={formik.handleChange}
        />
        <div className="error">{formik.errors.phone}</div>

        <div className="button-container">
          <button className="button" type="submit">Update user</button>
          <button className="button" onClick={() => navigate(`/profile`)}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default ModifyUserForm
