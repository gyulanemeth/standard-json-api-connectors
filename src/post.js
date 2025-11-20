import throwOnError from './helpers/throwOnError.js'
import createResponseObject from './helpers/createResponseObject.js'
import { CorsError } from 'standard-api-errors'

export default (fetch, apiUrl, generateRoute, generateHeaderFields = () => ({}), options = {}) => async (params, body) => {
  let response
  const requestOptions = {
    method: 'POST',
    headers: {
      ...generateHeaderFields(params),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  if (options.timeout) {
    requestOptions.signal = AbortSignal.timeout(options.timeout)
  }
  try {
    response = await fetch(apiUrl + generateRoute(params), requestOptions)
  } catch (error) {
    console.log(error)
    throw new CorsError()
  }
  await throwOnError(response)
  return await createResponseObject(response)
}
