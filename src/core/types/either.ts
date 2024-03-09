// Error
export class Failure<F> {
  readonly value: F
  readonly type = 'failure'

  constructor(value: F) {
    this.value = value
  }
}

// Success
export class Success<S> {
  readonly value: S
  readonly type = 'success'

  constructor(value: S) {
    this.value = value
  }
}

// All the use cases responses use the Either, because it can be an Failure or Success
export type Either<F, S> = Failure<F> | Success<S>

// failure and success are functions for make the classes above
export const failure = <F, S>(value: F): Either<F, S> => {
  return new Failure(value)
}

export const success = <F, S>(value: S): Either<F, S> => {
  return new Success(value)
}

// isSuccess is a function to confirm an success, it also alters the typing, removing the possibility of an failure
export const isSuccess = <F, S>(input: Either<F, S>): input is Success<S> => {
  return input.type === 'success'
}

// isFailure is a function to confirm an failure, it also alters the typing, removing the possibility of an success
export const isFailure = <F, S>(input: Either<F, S>): input is Failure<F> => {
  return input.type === 'failure'
}
