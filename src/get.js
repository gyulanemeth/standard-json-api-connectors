import qs from 'qs'

import throwOnError from './helpers/throwOnError.js'
import createResponseObject from './helpers/createResponseObject.js'

import { CorsError } from 'standard-api-errors'

export default (fetch, apiUrl, generateRoute, generateHeaderFields = () => ({})) => async (params, query) => {
  const queryString = qs.stringify(query, { encodeValuesOnly: true })
  let response
  try {
    response = await fetch(`${apiUrl}${generateRoute(params)}${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        ...generateHeaderFields(params),
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    throw new CorsError()
  }
  await throwOnError(response)
  return await createResponseObject(response)
}
