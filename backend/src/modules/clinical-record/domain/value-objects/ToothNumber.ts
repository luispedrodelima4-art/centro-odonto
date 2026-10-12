import { Result } from '../../../../shared/domain/Result.js';
import { ValueObject } from '../../../../shared/domain/ValueObject.js';

interface ToothNumberProps {
  value: number;
  isPrimary: boolean;
}

/**
 * Validates tooth numbering following the international two-digit FDI World Dental Federation system.
 * Permanent teeth:
 *  - Quadrant 1 (Upper Right): 11 - 18
 *  - Quadrant 2 (Upper Left): 21 - 28
 *  - Quadrant 3 (Lower Left): 31 - 38
 *  - Quadrant 4 (Lower Right): 41 - 48
 * Primary (Deciduous) teeth:
 *  - Quadrant 5 (Upper Right): 51 - 55
 *  - Quadrant 6 (Upper Left): 61 - 65
 *  - Quadrant 7 (Lower Left): 71 - 75
 *  - Quadrant 8 (Lower Right): 81 - 85
 */
export class ToothNumber extends ValueObject<ToothNumberProps> {
  private static readonly PERMANENT_TEETH = new Set([
    11, 12, 13, 14, 15, 16, 17, 18,
    21, 22, 23, 24, 25, 26, 27, 28,
    31, 32, 33, 34, 35, 36, 37, 38,
    41, 42, 43, 44, 45, 46, 47, 48
  ]);

  private static readonly PRIMARY_TEETH = new Set([
    51, 52, 53, 54, 55,
    61, 62, 63, 64, 65,
    71, 72, 73, 74, 75,
    81, 82, 83, 84, 85
  ]);

  get value(): number {
    return this.props.value;
  }

  get isPrimary(): boolean {
    return this.props.isPrimary;
  }

  public static create(toothNumber: number): Result<ToothNumber> {
    if (this.PERMANENT_TEETH.has(toothNumber)) {
      return Result.ok<ToothNumber>(new ToothNumber({ value: toothNumber, isPrimary: false }));
    }

    if (this.PRIMARY_TEETH.has(toothNumber)) {
      return Result.ok<ToothNumber>(new ToothNumber({ value: toothNumber, isPrimary: true }));
    }

    return Result.fail<ToothNumber>(
      `Invalid FDI tooth number: ${toothNumber}. Must be a valid permanent (11-48) or primary (51-85) tooth.`
    );
  }
}
