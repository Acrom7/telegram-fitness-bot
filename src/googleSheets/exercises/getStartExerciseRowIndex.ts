const START_OFFSET_ROW = 3;
const ROWS_BETWEEN_EXERCISES = 4;

/**
 * Возвращает номер строки в таблице, где начинается упражнение
 * @param exerciseNumber - порядковый номер упражнения (1, 2, 3)
 * @returns номер строки
 */
export function getStartExerciseRowIndex(exerciseNumber: number) {
    return START_OFFSET_ROW + (exerciseNumber - 1) * ROWS_BETWEEN_EXERCISES;
}
