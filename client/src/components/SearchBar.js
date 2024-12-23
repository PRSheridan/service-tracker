import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as yup from "yup"
import UserContext from "../context"

function SearchBar( {queues} ) {
  const user = useContext(UserContext)
  const navigate = useNavigate()
  const [filteredTickets, setFilteredTickets] = useState([])
  const [errors, setErrors] = useState([])

  const formSchema = yup.object().shape({
    searchTerm: yup
      .string()
      .required("Must enter a search term")
      .max(64, "Search term must be less than 64 characters")
  })

  // Formik setup for handling form state and validation
  const formik = useFormik({
    initialValues: { searchTerm: "" },
    validationSchema: formSchema,
    onSubmit: (values) => {
      const searchTerm = values.searchTerm.toLowerCase()

      fetch(`/tickets/search?q=${searchTerm}`)
        .then(response => {
          if (response.ok) { response.json()
            .then(data => {
              if (data.length === 0) {
                setFilteredTickets([])
              } else {
                setFilteredTickets(data)
              }
            })
          }
        })
    }
  })

  const clearSearch = () => {
    setFilteredTickets([])
    formik.setFieldValue('searchTerm', '')
  }

  return (
    <div className="search-box">
      <nav id="searchbar">
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            id="searchTerm"
            placeholder="Search tickets by title, requestor, tags, or ID..."
            autoComplete="off"
            value={formik.values.searchTerm}
            onChange={formik.handleChange}
          />
          <button className="button" type="submit">
            Search
          </button>
          <button className="button clear-search" type="button" onClick={clearSearch}>
            Clear
          </button>
          {formik.errors.searchTerm ? <div className="error">{formik.errors.searchTerm}</div> : <div className="spacer-small"></div>}
        </form>
      </nav>
      {filteredTickets.length > 0 && (
        <div className="ticket-list">
          <div className="search-results">Search Results</div>
          <div className="queue-display-header">
            <div className="ticket-cell">Ticket ID</div>
            <div className="ticket-cell">Title</div>
            <div className="ticket-cell">Matching Attribute</div>
          </div>
          {filteredTickets.map(ticket => {
            const searchTerm = formik.values.searchTerm.toLowerCase()
            let matchingAttribute = ""

            if (ticket.title.toLowerCase().includes(searchTerm)) {
              matchingAttribute = `Title: ${ticket.title}`
            } else if (ticket.requestor.username.toLowerCase().includes(searchTerm)) {
              matchingAttribute = `Requestor: ${ticket.requestor.username}`
            } else if (ticket.id.toString().includes(searchTerm)) {
              matchingAttribute = `ID: ${ticket.id}`
            } else if (ticket.tags.some(tag => tag.name.toLowerCase().includes(searchTerm))) {
              const matchingTags = ticket.tags.filter(tag => tag.name.toLowerCase().includes(searchTerm)).map(tag => tag.name).join(", ")
              matchingAttribute = `Tags: ${matchingTags}`
            }

            return (
              <div key={ticket.id} className="ticket-row"
                   onClick={() => navigate(`/ticket/${ticket.id}`, { state: { ticket, user , queues} })}>
                <div className="ticket-cell">{ticket.id}</div>
                <div className="ticket-cell">{ticket.title}</div>
                <div className="ticket-cell">{matchingAttribute}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SearchBar




