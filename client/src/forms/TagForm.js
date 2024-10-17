import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'

function TagForm({ ticket, onClose }) {
  const [errors, setErrors] = useState([])
  const [tags, setTags] = useState([])
  const [filteredTags, setFilteredTags] = useState([])

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

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase()
    formik.setFieldValue("name", value)
    setFilteredTags(tags.filter(tag => tag.toLowerCase().includes(value)))
  }

  const handleTagSelect = (tag) => {
    formik.setFieldValue("name", tag)
    setFilteredTags([])
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
          onFocus={() => setFilteredTags(tags.filter(tag => tag.toLowerCase().includes(formik.values.name.toLowerCase())))}
        />
        {filteredTags.length > 0 && (
          <div className="autocomplete-results">
            {filteredTags.map((tag) => (
              <div 
                key={tag} 
                className="autocomplete-option" 
                onClick={() => handleTagSelect(tag)}>
                {tag}
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

export default TagForm

