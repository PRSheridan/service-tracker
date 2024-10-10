import React, { useState } from "react";
import { useFormik } from "formik"
import * as yup from "yup"

function CommentForm ( {ticket, onClose} ) {
    const [errors, setErrors] = useState([])

    const formSchema = yup.object().shape({
        content: yup.string().required("Comment must have content").max(256, "Content must be less than 256 characters"),
    })

    const formik = useFormik({
        initialValues: { content: "" },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`/tickets/${ticket.id}/comments`, {
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
            <form onSubmit={ formik.handleSubmit }>
                <div className="error">{formik.errors.content}</div>
                <textarea
                type="text"
                id="content"
                placeholder="Enter new comment"
                autoComplete="off"
                value={ formik.values.content }
                onChange={ formik.handleChange }
                rows="4"
                cols="50"
                />
            <div className="button-container">
                <button className="button" type="submit">Submit</button>
                <button className="button" onClick={() => onClose()}>Cancel</button>
            </div>
            {errors.length > 1 ? <div className="alert">{errors}</div> : <></>}
            </form>
        </div>
    )
}

export default CommentForm