import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

function Ticket({ onClose }) {
    const [errors, setErrors] = useState([]);

    //HONESTLY JUST GET THE CURRENT USER AND FILL IN THESE FIELDS?
    //VERY UNFINISHED ALMOST A DISASTER

    const formSchema = yup.object().shape({
        requestor_id: yup.number().required("Requestor ID is required"),
        queue: yup.string().required("Queue is required"),
        email: yup.string().email("Invalid email format").required("Email is required"),
        phone: yup.string().nullable(),
        title: yup.string().required("Title is required"),
        description: yup.string().required("Description is required"),
        priority: yup.string().required("Priority is required"),
        status: yup.string().required("Status is required"),
    });

    const formik = useFormik({
        initialValues: {
            queue: '',
            email: '',
            phone: '',
            title: '',
            description: '',
            priority: '',
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch('/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values, null, 1),
            }).then((response) => {
                if (response.ok) {
                    onClose();
                } else {
                    response.json().then((err) => setErrors(err.errors));
                }
            });
        },
    });

    return (
        <div className="new-form">
            <div>New Ticket:</div>
            <form onSubmit={formik.handleSubmit}>
                <div className="error">{formik.errors.queue}</div>
                <select
                    type="text"
                    id="queue"
                    autoComplete="off"
                    value={ formik.values.queue }
                    onChange={ formik.handleChange }>
                        <option value="THESE OPTIONS NEED TO BE A LIST OF ALL AVAILABLE QUEUES">THESE OPTIONS NEED TO BE A LIST OF ALL AVAILABLE QUEUES</option>
                        <option value="owner">owner</option>
                </select>
                <div className="error">{formik.errors.email}</div>
                <input
                    type="email"
                    id="email"
                    autoComplete="off"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                />
                <div className="error">{formik.errors.phone}</div>
                <input
                    type="text"
                    id="phone"
                    autoComplete="off"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                />
                <div className="error">{formik.errors.title}</div>
                <input
                    type="text"
                    id="title"
                    autoComplete="off"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                />
                <div className="error">{formik.errors.description}</div>
                <textarea
                    id="description"
                    autoComplete="off"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    rows="4"
                    cols="50"
                />
                <div className="error">{formik.errors.priority}</div>
                <select
                    type="text"
                    id="priority"
                    autoComplete="off"
                    value={ formik.values.priority }
                    onChange={ formik.handleChange }>
                        <option value="THESE OPTIONS NEED TO BE A LIST OF ALL AVAILABLE PRIORITIES">THESE OPTIONS NEED TO BE A LIST OF ALL AVAILABLE PRIORITIES</option>
                        <option value="owner">owner</option>
                </select>
                <div className="button-container">
                    <button className="button" type="submit">Create Ticket</button>
                    <button className="button" onClick={() => onClose()}>Cancel</button>
                </div>
                {errors.length > 0 && <div className="alert">{errors.join(', ')}</div>}
            </form>
        </div>
    );
}

export default Ticket;