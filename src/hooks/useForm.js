import { useState } from 'react'

function useForm(initial_form_state, submitFn) {
    const [formState, setFormState] = useState(initial_form_state)

    function handleChange(event) {
        const field_name = event.target.name
        const field_value = event.target.value
        setFormState((prev_state) => {
            return {
                ...prev_state,
                [field_name]: field_value
            }
        })
    }

    function handleSubmit(event) {
        event.preventDefault()
        submitFn(formState)
    }

    function resetForm() {
        setFormState(initial_form_state)
    }

    return {
        formState,
        handleChange,
        handleSubmit,
        resetForm,
        setFormState
    }
}

export default useForm
