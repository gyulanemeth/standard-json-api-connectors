import throwOnError from './helpers/throwOnError.js'
import createResponseObject from './helpers/createResponseObject.js'
import { CorsError } from 'standard-api-errors'

export default (fetch, apiUrl, fieldName, generateRoute, generateHeaderFields = () => ({}), options = {}) => async (params, body) => {
  let response
  const requestOptions = {
    method: 'POST',
    headers: {
      ...generateHeaderFields(params)
    }
  }
  if (options.timeout) {
    requestOptions.signal = AbortSignal.timeout(options.timeout)
  }
  try {
    const formData = new FormData()
    formData.append(fieldName, body)
    requestOptions.body = formData
    response = await fetch(apiUrl + generateRoute(params), requestOptions)
  } catch (error) {
    throw new CorsError()
  }
  await throwOnError(response)
  return await createResponseObject(response)
}
