import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = fromZodError(error).details.map((detail) => {
          return { field: detail.path[0], message: detail.message }
        })
        throw new BadRequestException({ errors: formattedErrors })
      }

      throw new BadRequestException('Validation failed')
    }

    return value
  }
}
