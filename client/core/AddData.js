import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';



const initialFValues = {
    manufacturer: '',
    model: '',
    year: ''
}

export default function AddData(props) {
    const { addOrEdit, recordForEdit } = props

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('manufacturer' in fieldValues)
            temp.manufacturer = fieldValues.manufacturer ? "" : "This field is required."
        if ('model' in fieldValues)
            temp.model = fieldValues.model ? "" : "This field is required."
        if ('year' in fieldValues)
            temp.year = fieldValues.year ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            addOrEdit(values, resetForm);
        }
    }

    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
    }, [recordForEdit])

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={6}>
                    <Controls.Input
                        name="manufacturer"
                        label="Car Manufacturer"
                        value={values.manufacturer}
                        onChange={handleInputChange}
                        error={errors.manufacturer}
                    />
                    <Controls.Input
                        name="model"
                        label="Car model"
                        value={values.model}
                        onChange={handleInputChange}
                        error={errors.model}
                    />
                    <Controls.Input
                        name="year"
                        label="Car year"
                        value={values.year}
                        onChange={handleInputChange}
                        error={errors.year}
                    />


                </Grid>

                <div>
                    <Controls.Button
                        type="submit"
                        text="Submit" />
                    <Controls.Button
                        text="Reset"
                        color="default"
                        onClick={resetForm} />
                </div>
            </Grid>
            </Grid>
        </Form >
    )
}