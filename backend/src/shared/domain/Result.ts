export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  private readonly _error: string | null;
  private readonly _value: T | undefined;

  private constructor(isSuccess: boolean, error: string | null = null, value?: T) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: A result cannot be successful and contain an error');
    }
    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: A failing result needs to contain an error message');
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._error = error;
    this._value = value;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(`Can't retrieve the value from a failed result. Error: ${this._error}`);
    }

    return this._value as T;
  }

  public getError(): string {
    return this._error ?? '';
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine(results: Result<unknown>[]): Result<unknown> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }
}
