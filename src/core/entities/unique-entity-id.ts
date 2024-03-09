import { randomUUID } from 'node:crypto'

export class UniqueEntityId {
  private id: string

  toString() {
    return this.id
  }

  constructor(id?: string) {
    this.id = id ?? randomUUID()
  }
}
