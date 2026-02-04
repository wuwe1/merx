export const ExitCode = {
  SUCCESS: 0,
  PARSE_ERROR: 1,
  FILE_NOT_FOUND: 2,
  INVALID_OPTIONS: 3,
  WRITE_ERROR: 4
} as const

export type ExitCodeType = typeof ExitCode[keyof typeof ExitCode]
