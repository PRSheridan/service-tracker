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
            <div>New Comment:</div>
            <form onSubmit={ formik.handleSubmit }>
                <div className="error">{formik.errors.content}</div>
                <input
                type="text"
                id="content"
                autoComplete="off"
                value={ formik.values.content }
                onChange={ formik.handleChange }
                />
            <div>
                <button className="button new" type="submit">Add comment</button>
                <button className="button delete" onClick={()=> onClose()}>cancel</button>
                {errors.length > 1 ? <div className="alert">{errors}</div> : <></>}
            </div>
            </form>
        </div>
    )
}

export default CommentForm