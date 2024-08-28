import throwOnError from './helpers/throwOnError.js'
import createResponseObject from './helpers/createResponseObject.js'
import { CorsError } from 'standard-api-errors'

export default (fetch, apiUrl, generateRoute, generateHeaderFields = () => ({}), options = {}) => async (params, body) => {
  let response
  const requestOptions = {
    method: 'PATCH',
    headers: {
      ...generateHeaderFields(params),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  if (options.signal) {
    requestOptions.signal = AbortSignal.timeout(options.signal)
  }
  try {
    response = await fetch(apiUrl + generateRoute(params), requestOptions)
  } catch (error) {
    throw new CorsError()
  }
  await throwOnError(response)
  return await createResponseObject(response)
}
