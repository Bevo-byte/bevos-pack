export type WalkRequest = {
  days: Array<{
    dateLabel: string
    time: string
    durationMinutes: number
    repeatWeekly: boolean
  }>
}