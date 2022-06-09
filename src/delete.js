import throwOnError from './helpers/throwOnError.js'
import createResponseObject from './helpers/createResponseObject.js'

export default (fetch, apiUrl, generateRoute, generateHeaderFields = () => ({})) => async (params) => {
  const response = await fetch(apiUrl + generateRoute(params), {
    method: 'DELETE',
    headers: {
      ...generateHeaderFields(params),
      'Content-Type': 'application/json'
    }
  })

  await throwOnError(response)
  return await createResponseObject(response)
}
