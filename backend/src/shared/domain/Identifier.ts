import crypto from 'node:crypto';

export class UniqueEntityId {
  private readonly value: string;

  constructor(id?: string) {
    this.value = id ?? crypto.randomUUID();
  }

  public equals(id?: UniqueEntityId): boolean {
    if (!id) return false;
    return id.toValue() === this.value;
  }

  public toString(): string {
    return this.value;
  }

  public toValue(): string {
    return this.value;
  }
}
