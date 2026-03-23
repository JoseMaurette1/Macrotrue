export type LogData = Record<string, unknown>;

export type Logger = ReturnType<typeof createLogger>;

export function createLogger(correlationId: string) {
  const base = { correlationId };
  return {
    info: (event: string, data: LogData = {}) =>
      console.log(JSON.stringify({ level: "info", event, ...base, ...data, ts: Date.now() })),
    warn: (event: string, data: LogData = {}) =>
      console.warn(JSON.stringify({ level: "warn", event, ...base, ...data, ts: Date.now() })),
    error: (event: string, data: LogData = {}) =>
      console.error(JSON.stringify({ level: "error", event, ...base, ...data, ts: Date.now() })),
  };
}
