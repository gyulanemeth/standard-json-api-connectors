import {
  ApiError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  MethodNotAllowedError,
  ConflictError,
  PayloadTooLargeError,
  TooManyRequestsError,
  InternalServerError,
  DatabaseConnectionError,
  NotImplementedError,
  BadGatewayError,
  ServiceUnavailableError,
  GatewayTimeoutError
} from 'standard-api-errors'

const nameLookup = {
  VALIDATION_ERROR: ValidationError,
  AUTHENTICATION_ERROR: AuthenticationError,
  AUTHORIZATION_ERROR: AuthorizationError,
  NOT_FOUND: NotFoundError,
  METHOD_NOT_ALLOWED: MethodNotAllowedError,
  CONFLICT: ConflictError,
  PAYLOAD_TOO_LARGE: PayloadTooLargeError,
  TOO_MANY_REQUESTS: TooManyRequestsError,
  INTERNAL_SERVER_ERROR: InternalServerError,
  DATABASE_CONNECTION_ERROR: DatabaseConnectionError,
  NOT_IMPLEMENTED: NotImplementedError,
  BAD_GATEWAY: BadGatewayError,
  SERVICE_UNAVAILABLE: ServiceUnavailableError,
  GATEWAY_TIMEOUT: GatewayTimeoutError
}

const statusLookup = {
  400: ValidationError,
  401: AuthenticationError,
  403: AuthorizationError,
  404: NotFoundError,
  405: MethodNotAllowedError,
  409: ConflictError,
  413: PayloadTooLargeError,
  429: TooManyRequestsError,
  500: InternalServerError,
  501: NotImplementedError,
  502: BadGatewayError,
  503: ServiceUnavailableError,
  504: GatewayTimeoutError
}

export default async (response) => {
  if (response.ok) {
    return
  }

  const contentType = response.headers.get('content-type')
  if (contentType.includes('application/json')) {
    const responseData = await response.json()

    if (responseData.error && responseData.error.name && nameLookup[responseData.error.name]) {
      throw new nameLookup[responseData.error.name](responseData.error.message)
    } else if (statusLookup[response.status]) {
      if (responseData.error && responseData.error.message) {
        throw new statusLookup[response.status](responseData.error.message)
      }
      throw new statusLookup[response.status](response.statusText)
    } else {
      throw new ApiError(response.status, response.statusText, responseData)
    }
  } else if (statusLookup[response.status]) {
    const responseData = await response.text()

    throw new statusLookup[response.status](responseData)
  } else {
    const responseData = await response.text()
    throw new ApiError(response.status, response.statusText, responseData)
  }
}
