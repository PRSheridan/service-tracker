import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'

function QueueForm({ ticket, onClose }) {
  const [errors, setErrors] = useState([])
  const [queues, setQueues] = useState([])

  useEffect(() => {
    fetch(`/queues`)
      .then(response => response.json())
      .then(data => {
        setQueues(data)
      })
  }, [])

  const formSchema = yup.object().shape({
    name: yup.string().required("Select a queue to add").max(256, "Name must be less than 256 characters"),
  })

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: formSchema,
    onSubmit: (values) => {
      const url = ticket ? `/ticket/${ticket.id}/queue` : '/user/queues'
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values, null, 1),
      }).then((response) => {
        if (response.ok) { onClose() } 
        else { response.json().then((err) => setErrors(err.errors)) }
      })
    },
  })

  return (
    <div className="new-form">
      <form onSubmit={formik.handleSubmit}>
        <div className="error">{formik.errors.name}</div>
        <select
          type="text"
          id="name"
          autoComplete="off"
          value={formik.values.name}
          onChange={formik.handleChange}>
          {queues.map((queue) => (
            <option value={queue} key={queue}>{queue}</option>
          ))}
        </select>
        <div className="button-container">
          <button className="button" type="submit">Submit</button>
          <button className="button" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default QueueForm


