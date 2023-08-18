import throwOnError from './helpers/throwOnError.js'
import createResponseObject from './helpers/createResponseObject.js'
import { CorsError } from 'standard-api-errors'

export default (fetch, apiUrl, generateRoute, generateHeaderFields = () => ({})) => async (params, body) => {
  let response
  try {
    response = await fetch(apiUrl + generateRoute(params), {
      method: 'POST',
      headers: {
        ...generateHeaderFields(params),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  } catch (error) {
    throw new CorsError()
  }
  await throwOnError(response)
  return await createResponseObject(response)
}
