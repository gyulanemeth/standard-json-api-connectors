import throwOnError from './helpers/throwOnError.js'
import createResponseObject from './helpers/createResponseObject.js'

export default (fetch, apiUrl, generateRoute, generateHeaderFields = () => ({})) => async (params, body) => {
  const response = await fetch(apiUrl + generateRoute(params), {
    method: 'PUT',
    headers: {
      ...generateHeaderFields(params),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  await throwOnError(response)
  return await createResponseObject(response)
}
