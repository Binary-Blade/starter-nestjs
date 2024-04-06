import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  /**
   * Converts a duration string in days to seconds.
   *
   * @param duration The duration string to convert.
   * @returns The duration in seconds.
   */
  convertDaysToSeconds(duration: string): number {
    const days = parseInt(duration.replace('d', ''), 10);
    return isNaN(days) ? 0 : days * 86400;
  }
}
