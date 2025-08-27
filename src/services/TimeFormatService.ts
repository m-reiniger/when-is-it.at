import { DateTime, Duration, type DurationUnit } from 'luxon';

export class TimeFormatService {
    // Check if event is in the future
    public static isInFuture(currentTime: Date, eventTime: Date): boolean {
        return eventTime.getTime() > currentTime.getTime();
    }

    // Get current time zone name
    public static getCurrentTimeZoneName(): string {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    // Get local date time formatted
    public static getLocalDateTime(eventTime: Date): string {
        return Intl.DateTimeFormat(undefined, {
            dateStyle: 'full',
            timeStyle: 'long',
        }).format(eventTime);
    }

    // Get original time zone date time formatted
    public static getOriginalTimeZoneDateTime(eventTime: Date, originalTimeZone: string): string {
        return Intl.DateTimeFormat(undefined, {
            dateStyle: 'full',
            timeStyle: 'long',
            timeZone: originalTimeZone,
        }).format(eventTime);
    }

    // Get relative date difference
    public static getRelativeDateDifference(currentTime: Date, eventTime: Date): string {
        const diff = this.getTimeDifferenceDuration(currentTime, eventTime, [
            'years',
            'months',
            'days',
        ] as DurationUnit[]);

        return diff.toHuman({
            unitDisplay: 'long',
            showZeros: false,
        });
    }

    // Get relative time difference
    public static getRelativeTimeDifference(currentTime: Date, eventTime: Date): string {
        const diff = this.getTimeDifferenceDuration(currentTime, eventTime, [
            'years',
            'months',
            'days',
            'hours',
            'minutes',
            'seconds',
        ] as DurationUnit[]);

        return `${diff.hours}h ${diff.minutes}m ${Math.floor(diff.seconds)}s`;
    }

    public static getGeneralTimeDifferenceString(
        currentTime: Date,
        eventTime: Date,
        values: DurationUnit[],
    ): string {
        const diff = this.getTimeDifferenceDuration(currentTime, eventTime, values);
        const firstUnit = values[0].slice(0, -1) as DurationUnit;

        return diff.get(firstUnit) !== 0
            ? diff.toHuman({
                  unitDisplay: 'long',
                  showZeros: false,
              })
            : '';
    }

    private static getTimeDifferenceDuration(
        currentTime: Date,
        eventTime: Date,
        values: DurationUnit[],
        floorLastUnit: boolean = true,
    ): Duration {
        const nowDateTime = DateTime.fromJSDate(currentTime);
        const eventDateTime = DateTime.fromJSDate(eventTime);
        const inFuture = this.isInFuture(currentTime, eventTime);

        const diff = inFuture
            ? eventDateTime.diff(nowDateTime, values)
            : nowDateTime.diff(eventDateTime, values);

        if (floorLastUnit) {
            const lastUnit = values[values.length - 1].slice(0, -1) as DurationUnit;
            return diff.set({
                [lastUnit]: Math.floor(diff.get(lastUnit)),
            });
        } else {
            return diff;
        }
    }
}
