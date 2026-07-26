// Swiss Ephemeris wrapper
// Nota: swisseph é uma dependência nativa que requer a pasta de dados efemérides

import { config } from '../config';
import { logger } from '../lib/logger';

export interface EphemerisResult {
  julianDay: number;
  sunLongitude: number;
  moonLongitude: number;
  planetPositions: Record<string, number>;
  ascendant: number;
}

export class SwissEphemerisService {
  private initialized = false;

  async init(): Promise<void> {
    try {
      const swisseph = await import('swisseph');
      swisseph.swe_set_ephe_path(config.ephemeris.path);
      this.initialized = true;
      logger.info('Swiss Ephemeris initialized');
    } catch (err) {
      logger.warn({ err }, 'Swiss Ephemeris not available, using fallback');
      this.initialized = false;
    }
  }

  async calculatePositions(
    year: number,
    month: number,
    day: number,
    hour: number,
    latitude: number,
    longitude: number
  ): Promise<EphemerisResult> {
    if (!this.initialized) {
      return this.fallbackPositions(year, month, day, hour);
    }

    try {
      const swisseph = await import('swisseph');

      const julianDay = swisseph.swe_julday(
        year, month, day, hour,
        swisseph.SE_GREG_CAL
      );

      const flags = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED;

      const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
      const planetIds = [
        swisseph.SE_SUN, swisseph.SE_MOON, swisseph.SE_MERCURY,
        swisseph.SE_VENUS, swisseph.SE_MARS, swisseph.SE_JUPITER,
        swisseph.SE_SATURN, swisseph.SE_URANUS, swisseph.SE_NEPTUNE,
        swisseph.SE_PLUTO,
      ];

      const planetPositions: Record<string, number> = {};

      for (let i = 0; i < planets.length; i++) {
        const result = swisseph.swe_calc_ut(julianDay, planetIds[i], flags);
        planetPositions[planets[i]] = result.data[0];
      }

      // Cálculo simplificado do Ascendente
      const houses = swisseph.swe_houses_ex(julianDay, flags, latitude, longitude, 'P');
      const ascendant = houses.data[0];

      return {
        julianDay,
        sunLongitude: planetPositions['sun'],
        moonLongitude: planetPositions['moon'],
        planetPositions,
        ascendant,
      };
    } catch (err) {
      logger.error({ err }, 'Swiss Ephemeris calculation error, using fallback');
      return this.fallbackPositions(year, month, day, hour);
    }
  }

  private fallbackPositions(
    year: number,
    month: number,
    day: number,
    hour: number
  ): EphemerisResult {
    // Fallback simplificado baseado em aproximações
    const dayOfYear = this.dayOfYear(year, month, day);
    const sunLongitude = (dayOfYear / 365) * 360;
    const moonLongitude = ((dayOfYear * 13.37) % 360);

    return {
      julianDay: this.approximateJulianDay(year, month, day, hour),
      sunLongitude,
      moonLongitude,
      planetPositions: {
        sun: sunLongitude,
        moon: moonLongitude,
        mercury: (sunLongitude + 28) % 360,
        venus: (sunLongitude + 45) % 360,
        mars: (sunLongitude + 60) % 360,
        jupiter: (sunLongitude + 120) % 360,
        saturn: (sunLongitude + 180) % 360,
        uranus: (sunLongitude + 210) % 360,
        neptune: (sunLongitude + 240) % 360,
        pluto: (sunLongitude + 270) % 360,
      },
      ascendant: ((hour / 24) * 360 + sunLongitude) % 360,
    };
  }

  private dayOfYear(year: number, month: number, day: number): number {
    const date = new Date(year, month - 1, day);
    const start = new Date(year, 0, 0);
    return Math.floor((date.getTime() - start.getTime()) / 86400000);
  }

  private approximateJulianDay(year: number, month: number, day: number, hour: number): number {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4)
      - Math.floor(y / 100) + Math.floor(y / 400) - 32045.5 + hour / 24;
  }
}
