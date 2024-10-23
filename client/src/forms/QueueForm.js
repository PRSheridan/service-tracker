import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'

function QueueForm({ queues, ticket, onClose }) {
  const [errors, setErrors] = useState([])
  const [filteredQueues, setFilteredQueues] = useState([])

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
        console.log(queues)
        if (response.ok) { onClose() } 
        else { response.json().then((err) => setErrors(err.errors)) }
      })
    },
  })

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase()
    formik.setFieldValue("name", value)
    setFilteredQueues(queues.filter(queue => queue.name.toLowerCase().includes(value)))
  }

  const handleQueueSelect = (queue) => {
    formik.setFieldValue("name", queue)
    setFilteredQueues([])
  }

  return (
    <div className="new-form">
      <form onSubmit={formik.handleSubmit}>
        <div className="error">{formik.errors.name}</div>
        <input
          type="text"
          id="name"
          autoComplete="off"
          value={formik.values.name}
          onChange={handleInputChange}
          onFocus={() => setFilteredQueues(queues.filter(queue => queue.name.toLowerCase().includes(formik.values.name.toLowerCase())))}
        />
        {filteredQueues.length > 0 && (
          <div className="autocomplete-results">
            {filteredQueues.map((queue) => (
              <div 
                key={queue.name} 
                className="autocomplete-option" 
                onClick={() => handleQueueSelect(queue.name)}>
                {queue.name}
              </div>
            ))}
          </div>
        )}
        <div className="button-container">
          <button className="button" type="submit">Submit</button>
          <button className="button" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default QueueForm
