import fetch from 'node-fetch'

const create = async (car) => {
  try {
    let response = await fetch('/api/cars/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(car)
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const list = async (page, rowsPerPage, signal) => {
  try {
    let response = await fetch(`/api/cars?page=${page}&limit=${rowsPerPage}`, {
      method: 'GET',
      signal: signal,
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const search = async (searchString) => {
  try {
    let response = await fetch(`/api/cars/search?q=${searchString}`, {
      method: 'GET'
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const read = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/cars/' + params.carId, {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const update = async (params, credentials, car) => {
  try {
    let response = await fetch('/api/cars/' + params.carId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(car)
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const remove = async (params, credentials) => {
  try {
    let response = await fetch('/api/cars/' + params.carId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const uploadCSV = async (page, rowsPerPage, signal) => {
  try {
    let response = await fetch(`/api/cars?page=${page}&limit=${rowsPerPage}`, {
      method: 'GET',
      signal: signal,
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

export {
  create,
  list,
  read,
  update,
  remove,
  search
}