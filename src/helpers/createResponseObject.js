export default async (response) => {
  const contentType = response.headers.get('content-type')
  const responseData = contentType.includes('application/json') ? await response.json() : await response.text()

  return typeof responseData === 'string' ? responseData : responseData.result
}
