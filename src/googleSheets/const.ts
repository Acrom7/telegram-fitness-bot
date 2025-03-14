import { DayOfWeek } from '@/types/dayOfWeek';

export const MAP_DAY_OF_WEEK_TO_COLUMN: Record<DayOfWeek, string> = {
    [DayOfWeek.Monday]: 'B',
    [DayOfWeek.Tuesday]: 'C',
    [DayOfWeek.Wednesday]: 'D',
    [DayOfWeek.Thursday]: 'E',
    [DayOfWeek.Friday]: 'F',
    [DayOfWeek.Saturday]: 'G',
    [DayOfWeek.Sunday]: 'H',
}

export const exerciseColumnName = 'Список упражнений';
