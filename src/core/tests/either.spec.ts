import { Either, failure, isFailure, isSuccess, success } from '../types/either'

function doSomeThing(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return success(10)
  } else {
    return failure('failure message')
  }
}

describe('Either error validations', () => {
  test('success result', () => {
    const successResult = doSomeThing(true)

    expect(successResult.type).toBe('success')
    expect(successResult.value).toBe(10)
    expect(isSuccess(successResult)).toBe(true)
    expect(isFailure(successResult)).toBe(false)
  })

  test('failure result', () => {
    const failureResult = doSomeThing(false)

    expect(failureResult.type).toBe('failure')
    expect(failureResult.value).toBe('failure message')
    expect(isSuccess(failureResult)).toBe(false)
    expect(isFailure(failureResult)).toBe(true)
  })
})
