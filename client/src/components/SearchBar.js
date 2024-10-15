import React, { useContext, useState, useEffect } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import UserContext from "../context"

function SearchBar() {
  const user = useContext(UserContext)
  const [tickets, setTickets] = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [errors, setErrors] = useState([])

  // Fetch tickets on component mount
  useEffect(() => {
    fetch('/tickets')
      .then(response => {
        if (response.ok) {
          response.json()
            .then(data => {
              setTickets(data)
              console.log("Fetched tickets:", data) // Debug log to verify fetched data
            })
        } else {
          console.error("Failed to fetch tickets") // Error handling
          setErrors(["Failed to fetch tickets"])
        }
      })
  }, [])

  const formSchema = yup.object().shape({
    searchTerm: yup
      .string()
      .required("Search term is required")
      .max(64, "Search term must be less than 64 characters")
  })

  // Formik setup for handling form state and validation
  const formik = useFormik({
    initialValues: { searchTerm: "" },
    validationSchema: formSchema,
    onSubmit: (values) => {
      const lowercasedTerm = values.searchTerm.toLowerCase()
      console.log("Searching for:", lowercasedTerm) // Debug log for search term

      // Filter the tickets based on title, tag, requestor, or ID
      const results = tickets.filter(ticket =>
        ticket.title.toLowerCase().includes(lowercasedTerm) ||
        ticket.tag?.toLowerCase().includes(lowercasedTerm) ||
        ticket.requestor.toLowerCase().includes(lowercasedTerm) ||
        ticket.id.toString().includes(lowercasedTerm) // Include ticket.id in the search
      )

      console.log("Filtered results:", results) // Debug log for filtered results

      if (results.length === 0) {
        setErrors(["No matching tickets found"]) // Set error if no results found
        setFilteredTickets([]) // Clear filtered tickets
      } else {
        setErrors([]) // Clear errors
        setFilteredTickets(results) // Update filtered tickets
      }
    }
  })

  return (
    <div>
      <nav id="searchbar">
        <form onSubmit={formik.handleSubmit}>
          {formik.errors.searchTerm && <div className="error">{formik.errors.searchTerm}</div>}

          <input
            type="text"
            id="searchTerm"
            placeholder="Search tickets by title, tag, requestor, or ID..."
            autoComplete="off"
            value={formik.values.searchTerm}
            onChange={formik.handleChange}
            style={{ padding: "5px", marginRight: "10px" }}
          />

          <button type="submit" style={{ padding: "5px 10px" }}>
            Search
          </button>

          {errors.length > 0 && <div className="alert">{errors[0]}</div>}
        </form>
      </nav>

      {filteredTickets.length > 0 && (
        <table style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Matching Attribute</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(ticket => {
              const searchTerm = formik.values.searchTerm.toLowerCase()
              let matchingAttribute = ""

              if (ticket.title.toLowerCase().includes(searchTerm)) {
                matchingAttribute = `Title: ${ticket.title}`
              } else if (ticket.tag?.toLowerCase().includes(searchTerm)) {
                matchingAttribute = `Tag: ${ticket.tag}`
              } else if (ticket.requestor.toLowerCase().includes(searchTerm)) {
                matchingAttribute = `Requestor: ${ticket.requestor}`
              } else if (ticket.id.toString().includes(searchTerm)) {
                matchingAttribute = `ID: ${ticket.id}` // Show ID if it matches
              }

              return (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{matchingAttribute}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default SearchBar

