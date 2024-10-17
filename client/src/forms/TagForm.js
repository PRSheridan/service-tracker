import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'

function TagForm({ ticket, onClose }) {
  const [errors, setErrors] = useState([])
  const [tags, setTags] = useState([])

  useEffect(() => {
    fetch(`/tags`)
      .then(response => response.json())
      .then(data => {
        setTags(data)
      })
  }, [])

  const formSchema = yup.object().shape({
    name: yup.string().required("Select a tag to add").max(64, "Name must be less than 64 characters"),
  })

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch(`/ticket/${ticket.id}/tag`, {
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
          {tags.map((tag) => (
            <option value={tag} key={tag}>{tag}</option>
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

export default TagForm
