import { IntegrityConstraintViolationError } from "slonik";

type IntegrityErrors = {
  [key: string]: any;
};

export class ModelError extends Error {
  integrityError: IntegrityConstraintViolationError;

  constructor(
    integrityErrors: IntegrityErrors,
    integrityError: IntegrityConstraintViolationError
  ) {
    super(integrityError.message);
    this.integrityError = integrityError;

    const constraintName = integrityError.constraint;
    if (Object.keys(integrityErrors).includes(constraintName)) {
      this.message = integrityErrors[constraintName];
    }
  }

  get details() {
    return {
      errorType: "model",
      errorData: {
        constraintName: this.integrityError.constraint,
        message: this.message,
      },
    };
  }
}

export class ResourceNotFoundError extends Error {
  constructor(modelName: string) {
    super(`${modelName} not found`);
  }

  get details() {
    return {
      errorType: "not-found",
      errorData: {
        message: this.message,
      },
    };
  }
}
