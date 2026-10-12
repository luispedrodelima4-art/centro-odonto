import { Entity } from '../../../../shared/domain/Entity.js';
import { UniqueEntityId } from '../../../../shared/domain/Identifier.js';
import { Result } from '../../../../shared/domain/Result.js';
import { ToothNumber } from '../value-objects/ToothNumber.js';
import { DentalProcedure } from './DentalProcedure.js';

export type ToothCondition =
  | 'SOUND'
  | 'CARIOUS'
  | 'RESTORED'
  | 'MISSING'
  | 'IMPACTED'
  | 'CROWN'
  | 'ENDODONTICALLY_TREATED'
  | 'IMPLANT'
  | 'EXTRACTED';

export interface ToothProps {
  toothNumber: ToothNumber;
  condition: ToothCondition;
  procedures: DentalProcedure[];
  notes?: string | undefined;
}

export class Tooth extends Entity<ToothProps> {
  private constructor(props: ToothProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get toothNumber(): ToothNumber {
    return this.props.toothNumber;
  }

  get condition(): ToothCondition {
    return this.props.condition;
  }

  get procedures(): DentalProcedure[] {
    return [...this.props.procedures];
  }

  public setCondition(newCondition: ToothCondition): void {
    this.props.condition = newCondition;
  }

  public addProcedure(procedure: DentalProcedure): void {
    this.props.procedures.push(procedure);
  }

  public static create(props: ToothProps, id?: UniqueEntityId): Result<Tooth> {
    return Result.ok<Tooth>(
      new Tooth(
        {
          ...props,
          procedures: [...props.procedures],
        },
        id
      )
    );
  }
}
