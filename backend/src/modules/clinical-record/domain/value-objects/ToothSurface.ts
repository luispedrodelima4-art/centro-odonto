import { Result } from '../../../../shared/domain/Result.js';
import { ValueObject } from '../../../../shared/domain/ValueObject.js';

export type SurfaceCode = 'M' | 'D' | 'O' | 'I' | 'V' | 'B' | 'L' | 'P';

interface ToothSurfaceProps {
  code: SurfaceCode;
  name: string;
}

/**
 * Standard anatomical tooth surfaces:
 * - M: Mesial (towards anterior midline)
 * - D: Distal (away from anterior midline)
 * - O: Occlusal (chewing surface of posterior teeth)
 * - I: Incisal (biting edge of anterior teeth)
 * - V / B: Vestibular / Buccal (facing cheek or lips)
 * - L / P: Lingual / Palatal (facing tongue or palate)
 */
export class ToothSurface extends ValueObject<ToothSurfaceProps> {
  private static readonly SURFACE_NAMES: Record<SurfaceCode, string> = {
    M: 'Mesial',
    D: 'Distal',
    O: 'Occlusal',
    I: 'Incisal',
    V: 'Vestibular',
    B: 'Buccal',
    L: 'Lingual',
    P: 'Palatal',
  };

  get code(): SurfaceCode {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  public static create(surfaceInput: string): Result<ToothSurface> {
    const normalized = surfaceInput.trim().toUpperCase() as SurfaceCode;
    const name = this.SURFACE_NAMES[normalized];

    if (!name) {
      return Result.fail<ToothSurface>(
        `Invalid tooth surface: '${surfaceInput}'. Must be one of: M, D, O, I, V, B, L, P.`
      );
    }

    return Result.ok<ToothSurface>(new ToothSurface({ code: normalized, name }));
  }
}
