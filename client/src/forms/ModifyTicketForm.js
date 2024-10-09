import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from 'formik';
import * as yup from 'yup';

function ModifyTicketForm() {
    const navigate = useNavigate()
    const location = useLocation()
    const ticket = location.state.ticket
    
    const [errors, setErrors] = useState([])
    const [queues, setQueues] = useState([])

    useEffect(() => {
        fetch(`/queues`)
          .then(response => response.json())
          .then(data => {
            setQueues(data);
          })
      }, []);

    const formSchema = yup.object().shape({
        queue: yup.string().required("Queue is required"),
        requestor: yup.string().required("Requestor ID is required"),
        email: yup.string().email("Invalid email format").required("Email is required"),
        phone: yup.string().nullable(),
        title: yup.string().required("Title is required"),
        description: yup.string().required("Description is required"),
        priority: yup.string().required("Priority is required"),
    });

    const formik = useFormik({
        initialValues: {
            queue: '',
            requestor: ticket.requestor.username,
            email: ticket.email,
            phone: ticket.phone,
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority,
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`/ticket/${ticket.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values, null, 1),
            }).then((response) => {
                if (response.ok) { navigate(`/ticket/${ticket.id}`, {state: {ticket: ticket}}) }
                else { response.json().then((err) => setErrors(err.errors)) }
            });
        },
    });

    return (
        <div className="new-form">
            <div>New Ticket:</div>
            <form onSubmit={formik.handleSubmit}>
                <div className="error">{formik.errors.queue}</div>
                <div className="ticket-field">Queue:</div>
                <select
                    type="text"
                    id="queue"
                    autoComplete="off"
                    value={ formik.values.queue }
                    onChange={ formik.handleChange }>
                    {queues.map((queue) => (
                        <option value={queue} key={queue}>{queue}</option>
                    ))}
                </select>
                <div className="error">{formik.errors.requestor}</div>
                <div className="ticket-field">Requestor:</div>
                <input
                    type="text"
                    id="requestor"
                    autoComplete="off"
                    value={formik.values.requestor}
                    onChange={formik.handleChange}
                />
                <div className="error">{formik.errors.email}</div>
                <div className="ticket-field">Email:</div>
                <input
                    type="email"
                    id="email"
                    autoComplete="off"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                />
                <div className="error">{formik.errors.phone}</div>
                <div className="ticket-field">Phone:</div>
                <input
                    type="text"
                    id="phone"
                    autoComplete="off"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                />
                <div className="error">{formik.errors.title}</div>
                <div className="ticket-field">Title:</div>
                <input
                    type="text"
                    id="title"
                    autoComplete="off"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                />
                <div className="error">{formik.errors.description}</div>
                <div className="ticket-field">Description:</div>
                <textarea
                    id="description"
                    autoComplete="off"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    rows="4"
                    cols="50"
                />
                <div className="error">{formik.errors.priority}</div>
                <div className="ticket-field">Priority:</div>
                <select
                    type="text"
                    id="priority"
                    autoComplete="off"
                    value={ formik.values.priority }
                    onChange={ formik.handleChange }>
                        <option value="low">low</option>
                        <option value="mid">mid</option>
                        <option value="high">high</option>
                </select>
                <div className="button-container">
                    <button className="button" type="submit">Update Ticket</button>
                    <button className="button" onClick={ () => navigate(`/ticket/${ticket.id}`, {state: {ticket: ticket}}) }>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default ModifyTicketForm;