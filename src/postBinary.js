import throwOnError from './helpers/throwOnError.js'
import createResponseObject from './helpers/createResponseObject.js'
import { CorsError } from 'standard-api-errors'

export default (fetch, apiUrl, fieldName, generateRoute, generateHeaderFields = () => ({})) => async (params, body) => {
  let response
  try {
    const formData = new FormData()
    formData.append(fieldName, body)
    response = await fetch(apiUrl + generateRoute(params), {
      method: 'POST',
      headers: {
        ...generateHeaderFields(params)
      },
      body: formData
    })
  } catch (error) {
    throw new CorsError()
  }
  await throwOnError(response)
  return await createResponseObject(response)
}
