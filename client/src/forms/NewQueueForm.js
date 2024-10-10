import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function NewQueueForm({ ticket, onClose }) {
    const [errors, setErrors] = useState([]);

    const formSchema = yup.object().shape({
        name: yup.string().required("Queue must have a name").max(256, "Name must be less than 256 characters"),
    });

    const formik = useFormik({
        initialValues: { name: "" },
        validationSchema: formSchema,
        onSubmit: (values) => {
            const url = ticket ? `/ticket/${ticket.id}/queue` : '/user/queues';
            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values, null, 1),
            }).then((response) => {
                if (response.ok) { onClose(); }
                else { response.json().then((err) => setErrors(err.errors)); }
            });
        },
    });

    return (
        <div className="new-form">
            <form onSubmit={formik.handleSubmit}>
                <div className="error">{formik.errors.name}</div>
                <input
                    type="text"
                    id="name"
                    placeholder="Enter queue name"
                    autoComplete="off"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                />
                <div className="button-container">
                    <button className="button" type="submit">Submit</button>
                    <button className="button" type="button" onClick={onClose}>Cancel</button>
                </div>
                {errors.length > 1 ? <div className="alert">{errors}</div> : <></>}
            </form>
        </div>
    );
}

export default NewQueueForm;

