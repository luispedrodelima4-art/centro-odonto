import { Result } from '../../../../shared/domain/Result.js';
import { ValueObject } from '../../../../shared/domain/ValueObject.js';

export interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(props: EmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(emailStr: string): Result<Email> {
    if (!emailStr || emailStr.trim().length === 0) {
      return Result.fail<Email>('Email is required.');
    }

    const normalized = emailStr.trim().toLowerCase();
    if (!this.EMAIL_REGEX.test(normalized)) {
      return Result.fail<Email>('Invalid email address format.');
    }

    return Result.ok<Email>(new Email({ value: normalized }));
  }
}
