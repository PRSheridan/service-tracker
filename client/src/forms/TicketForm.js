import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from "react-router-dom"
import { useFormik } from 'formik'
import * as yup from 'yup'

function TicketForm() {
  const [errors, setErrors] = useState([])
  const [queues, setQueues] = useState([])

  const navigate = useNavigate()
  const { user } = useOutletContext()

  useEffect(() => {
    fetch(`/queues`)
      .then(response => response.json())
      .then(data => {
        setQueues(data)
      })
  }, [])

  const formSchema = yup.object().shape({
    queue: yup.string().required("Queue is required"),
    requestor: yup.string().required("Requestor ID is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    phone: yup.string().nullable(),
    priority: yup.string().required("Priority is required"),
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
  })

  const formik = useFormik({
    initialValues: {
      queue: '',
      requestor: user.username,
      email: user.email,
      phone: user.phone,
      priority: 'low',
      title: '',
      description: '',
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch('/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values, null, 1),
      }).then((response) => {
        if (response.ok) { navigate("/home") } 
        else { response.json().then((err) => setErrors(err.errors)) }
      })
    },
  })

  return (
    <div className="new-form">
      <h2>New Ticket:</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="ticket-field">Queue:</div>
        <select
          id="queue"
          autoComplete="off"
          value={formik.values.queue}
          onChange={formik.handleChange}>
          <option value="">Select a queue</option>
          {queues.map((queue) => (
            <option value={queue.name} key={queue.name}>{queue.name}</option>
          ))}
        </select>
        <div className="error">{formik.errors.queue}</div>
  
        <div className="ticket-field">Requestor:</div>
        <input
          type="text"
          id="requestor"
          autoComplete="off"
          value={formik.values.requestor}
          onChange={formik.handleChange}
        />
        <div className="error">{formik.errors.requestor}</div>
  
        <div className="ticket-field">Email:</div>
        <input
          type="email"
          id="email"
          autoComplete="off"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        <div className="error">{formik.errors.email}</div>
  
        <div className="ticket-field">Phone:</div>
        <input
          type="text"
          id="phone"
          autoComplete="off"
          value={formik.values.phone}
          onChange={formik.handleChange}
        />
        <div className="error">{formik.errors.phone}</div>
  
        <div className="ticket-field">Priority:</div>
        <select
          id="priority"
          autoComplete="off"
          value={formik.values.priority}
          onChange={formik.handleChange}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <div className="error">{formik.errors.priority}</div>
  
        <div className="ticket-field">Title:</div>
        <input
          type="text"
          id="title"
          autoComplete="off"
          value={formik.values.title}
          onChange={formik.handleChange}
        />
        <div className="error">{formik.errors.title}</div>
  
        <div className="ticket-field">Description:</div>
        <textarea
          id="description"
          autoComplete="off"
          value={formik.values.description}
          onChange={formik.handleChange}
          rows="4"
          cols="50"
        />
        <div className="error">{formik.errors.description}</div>
  
        <div className="button-container">
          <button className="button" type="submit">Create Ticket</button>
          <button className="button" onClick={() => navigate("/home")}>Cancel</button>
        </div>
      </form>
    </div>
  )
}  

export default TicketForm

