import { Entity } from '../../../../shared/domain/Entity.js';
import { UniqueEntityId } from '../../../../shared/domain/Identifier.js';
import { Result } from '../../../../shared/domain/Result.js';
import { ToothSurface } from '../value-objects/ToothSurface.js';

export type ProcedureStatus = 'PROPOSED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface DentalProcedureProps {
  procedureCode: string;
  name: string;
  surfaces: ToothSurface[];
  status: ProcedureStatus;
  priceInCents: number;
  performedByProfessionalId?: string | undefined;
  notes?: string | undefined;
  createdAt: Date;
  completedAt?: Date | undefined;
}

export class DentalProcedure extends Entity<DentalProcedureProps> {
  private constructor(props: DentalProcedureProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get procedureCode(): string {
    return this.props.procedureCode;
  }

  get name(): string {
    return this.props.name;
  }

  get surfaces(): ToothSurface[] {
    return [...this.props.surfaces];
  }

  get status(): ProcedureStatus {
    return this.props.status;
  }

  get priceInCents(): number {
    return this.props.priceInCents;
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  public complete(professionalId: string): Result<void> {
    if (this.props.status === 'COMPLETED') {
      return Result.fail('Procedure is already marked as completed.');
    }

    if (this.props.status === 'CANCELLED') {
      return Result.fail('Cannot complete a cancelled procedure.');
    }

    this.props.status = 'COMPLETED';
    this.props.performedByProfessionalId = professionalId;
    this.props.completedAt = new Date();

    return Result.ok();
  }

  public cancel(reason?: string): Result<void> {
    if (this.props.status === 'COMPLETED') {
      return Result.fail('Cannot cancel an already completed procedure.');
    }

    this.props.status = 'CANCELLED';
    if (reason) {
      this.props.notes = this.props.notes ? `${this.props.notes} | Cancel reason: ${reason}` : reason;
    }

    return Result.ok();
  }

  public static create(
    props: Omit<DentalProcedureProps, 'createdAt'> & { createdAt?: Date },
    id?: UniqueEntityId
  ): Result<DentalProcedure> {
    if (!props.procedureCode || props.procedureCode.trim().length === 0) {
      return Result.fail<DentalProcedure>('Procedure code is required.');
    }

    if (!props.name || props.name.trim().length === 0) {
      return Result.fail<DentalProcedure>('Procedure name is required.');
    }

    if (props.priceInCents < 0) {
      return Result.fail<DentalProcedure>('Procedure price cannot be negative.');
    }

    const procedure = new DentalProcedure(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return Result.ok<DentalProcedure>(procedure);
  }
}
