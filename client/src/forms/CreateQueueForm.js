import React, { useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"

function CreateQueueForm({ onClose }) {
    const [errors, setErrors] = useState([])

    const formSchema = yup.object().shape({
        name: yup
            .string()
            .required("Queue must have a name")
            .max(64, "Queue must be less than 64 characters")
    })

    const formik = useFormik({
        initialValues: { name: "" },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log(values)
            fetch(`/queues`, {
            method: "POST",
            headers: { "content-Type": "application/json" },
            body: JSON.stringify(values, null, 1),
            }).then((response) => {
                if (response.ok) { onClose() }
                else { response.json().then((err) => setErrors(err.errors)) }
            })
        }
    })

    return (
        <div className="new-form">
            <form onSubmit={ formik.handleSubmit }>
                {formik.errors.name && <div className="error">{formik.errors.name}</div>}
                <input
                type="text"
                id="name"
                placeholder="Enter new queue"
                autoComplete="off"
                value={ formik.values.name }
                onChange={ formik.handleChange }
                className="input-admin"
                />
            <div className="button-container-admin">
                <button className="button-admin" type="submit">Submit</button>
                <button className="button-admin" onClick={() => onClose()}>Cancel</button>
            </div>
            {/*errors.length > 1 ? <div className="alert">{errors}</div> : <></>*/}
            </form>
        </div>
    )
}

export default CreateQueueForm