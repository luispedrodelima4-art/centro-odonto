import { AggregateRoot } from '../../../../shared/domain/AggregateRoot.js';
import { UniqueEntityId } from '../../../../shared/domain/Identifier.js';
import { Result } from '../../../../shared/domain/Result.js';
import { DentalProcedure } from '../entities/DentalProcedure.js';
import { Tooth, ToothCondition } from '../entities/Tooth.js';
import { ToothNumber } from '../value-objects/ToothNumber.js';

export type DentitionType = 'PERMANENT' | 'PRIMARY' | 'MIXED';

export interface OdontogramProps {
  patientRecordId: string;
  dentitionType: DentitionType;
  teeth: Map<number, Tooth>;
  updatedAt: Date;
}

export class Odontogram extends AggregateRoot<OdontogramProps> {
  private constructor(props: OdontogramProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get patientRecordId(): string {
    return this.props.patientRecordId;
  }

  get dentitionType(): DentitionType {
    return this.props.dentitionType;
  }

  get teeth(): Tooth[] {
    return Array.from(this.props.teeth.values());
  }

  public getTooth(toothNumber: number): Tooth | undefined {
    return this.props.teeth.get(toothNumber);
  }

  public setToothCondition(toothNumber: number, condition: ToothCondition): Result<void> {
    const tooth = this.props.teeth.get(toothNumber);
    if (!tooth) {
      return Result.fail(`Tooth ${toothNumber} does not exist in this odontogram.`);
    }

    tooth.setCondition(condition);
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  public addProcedureToTooth(toothNumber: number, procedure: DentalProcedure): Result<void> {
    const tooth = this.props.teeth.get(toothNumber);
    if (!tooth) {
      return Result.fail(`Tooth ${toothNumber} not found in this dental chart.`);
    }

    tooth.addProcedure(procedure);
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  /**
   * Factory method to initialize a complete standard odontogram with all FDI teeth.
   */
  public static createNew(
    patientRecordId: string,
    dentitionType: DentitionType = 'PERMANENT',
    id?: UniqueEntityId
  ): Result<Odontogram> {
    const teethMap = new Map<number, Tooth>();

    // Standard 32 permanent teeth numbers in FDI notation
    const permanentNumbers = [
      11, 12, 13, 14, 15, 16, 17, 18,
      21, 22, 23, 24, 25, 26, 27, 28,
      31, 32, 33, 34, 35, 36, 37, 38,
      41, 42, 43, 44, 45, 46, 47, 48,
    ];

    for (const num of permanentNumbers) {
      const toothNumResult = ToothNumber.create(num);
      if (toothNumResult.isFailure) {
        return Result.fail<Odontogram>(toothNumResult.getError());
      }

      const toothResult = Tooth.create({
        toothNumber: toothNumResult.getValue(),
        condition: 'SOUND',
        procedures: [],
      });

      if (toothResult.isFailure) {
        return Result.fail<Odontogram>(toothResult.getError());
      }

      teethMap.set(num, toothResult.getValue());
    }

    const odontogram = new Odontogram(
      {
        patientRecordId,
        dentitionType,
        teeth: teethMap,
        updatedAt: new Date(),
      },
      id
    );

    return Result.ok<Odontogram>(odontogram);
  }
}
