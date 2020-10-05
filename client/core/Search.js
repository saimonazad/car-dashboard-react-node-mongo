import React from 'react';
import { search } from '../services/api-car'
import AsyncSelect from 'react-select/async';

export default function componentName(props) {

    const loadOptions = (inputValue, callback) => {
        var response = [];
        search(inputValue).then((data) => {
            if (data && data.error) {
                console.log(data.error)
            } else {

                response = data.cars

                callback(response.map(i => ({ label: i.model, value: i._id })))
            }
        })
        console.log(response)

    };
    const handleInputChange = e => {

    }
    const onSelectSearchResult = selectedModel => {
        search(selectedModel.label).then((data) => {
            if (data && data.error) {
                console.log(data.error)
            } else {
                console.log(data)
                props.onChange(data.cars)
            }
        })
    }

    return (
        <AsyncSelect
            loadOptions={loadOptions}
            onInputChange={handleInputChange}
            placeholder={'Search car model...'}
            onChange={onSelectSearchResult}
        />
    );
}
