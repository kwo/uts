declare const __VERSION__: string;
declare const __COMMIT_HASH__: string;
declare const __COMMIT_TS__: string;

const LEN_DATETIME_WITHOUT_TZ = 19;
const HELP_TEXT = `Usage:
    uts --help                              print help and exit
    uts --version [-v]                      print (extended) version and exit
    uts                                     print current unix timestamp
    uts <unix timestamp>                    parse unix timestamp and print date
    uts <YYYY-MM-DDTHH:MM:SS>               parse datetime in local timezone, print unix timestamp
    uts <YYYY-MM-DDTHH:MM:SSZ>              parse datetime in UTC, print unix timestamp
    uts <YYYY-MM-DDTHH:MM:SS+02:00>         parse datetime with given timezone, print unix timestamp
    uts <YYYY-MM-DD> <HH:MM:SS>             parse date and time and print unix timestamp
    uts <YYYY-MM-DD> <HH:MM:SS> <timezone>  parse date, time, timezone and print unix timestamp`;

interface DateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.includes("--version")) {
    if (args.includes("-v")) {
      console.log(
        `uts ${__VERSION__} ${__COMMIT_HASH__} ${formatCommitDate(__COMMIT_TS__)}`,
      );
    } else {
      console.log(`uts ${__VERSION__}`);
    }
    return;
  }

  if (args.includes("-h") || args.includes("--help")) {
    printHelp();
    return;
  }

  if (args.length === 0) {
    console.log(Math.floor(Date.now() / 1000));
    return;
  }

  if (args.length === 1) {
    const input = requireArg(args, 0);

    if (input.length < LEN_DATETIME_WITHOUT_TZ) {
      const timestamp = parseUnixTimestamp(
        input,
        "cannot parse unix timestamp: %s",
      );
      console.log(formatRFC3339Local(timestamp));
      return;
    }

    if (input.length === LEN_DATETIME_WITHOUT_TZ) {
      const timestamp = parseDateToUnix(input, "cannot parse datetime: %s");
      console.log(timestamp);
      return;
    }

    if (input.length === 20 || input.length === 25) {
      const timestamp = parseDateToUnix(input, "cannot parse datetime: %s");
      console.log(timestamp);
      return;
    }
  }

  if (args.length === 2) {
    const date = requireArg(args, 0);
    const time = requireArg(args, 1);
    const timestamp = parseDateToUnix(
      `${date}T${time}`,
      "cannot parse date and time: %s",
    );
    console.log(timestamp);
    return;
  }

  if (args.length === 3) {
    const date = requireArg(args, 0);
    const time = requireArg(args, 1);
    const timezoneArg = requireArg(args, 2);

    if (timezoneArg.length === 5 || timezoneArg.length === 6) {
      const timezone =
        timezoneArg.startsWith("+") || timezoneArg.startsWith("-")
          ? timezoneArg
          : `+${timezoneArg}`;
      const timestamp = parseDateToUnix(
        `${date}T${time}${timezone}`,
        "cannot parse date, time, timezone: %s",
      );
      console.log(timestamp);
      return;
    }

    const timestamp = parseNamedTimeZoneToUnix(date, time, timezoneArg);
    console.log(timestamp);
    return;
  }

  printHelp();
  process.exit(1);
}

function requireArg(args: readonly string[], index: number): string {
  const value = args[index];
  if (value === undefined) {
    handleError(
      new Error(`missing argument at index ${String(index)}`),
      "cannot parse arguments: %s",
    );
  }
  return value;
}

function parseUnixTimestamp(input: string, message: string): number {
  const timestamp = Number.parseInt(input, 10);
  if (Number.isNaN(timestamp)) {
    handleError(new Error(`invalid unix timestamp ${input}`), message);
  }
  return timestamp;
}

function parseDateToUnix(input: string, message: string): number {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    handleError(new Error(`invalid datetime ${input}`), message);
  }
  return Math.floor(date.getTime() / 1000);
}

function parseNamedTimeZoneToUnix(
  date: string,
  time: string,
  timeZone: string,
): number {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
  } catch (error) {
    handleError(toError(error), "cannot load location: %s");
  }

  let target: DateParts;

  try {
    target = parseDateParts(`${date} ${time}`);
  } catch (error) {
    handleError(toError(error), "cannot parse date: %s");
  }
  const naiveUTC = Date.UTC(
    target.year,
    target.month - 1,
    target.day,
    target.hour,
    target.minute,
    target.second,
  );
  let candidate = naiveUTC;

  for (let index = 0; index < 6; index += 1) {
    const offset = getTimeZoneOffsetMs(candidate, timeZone);
    const nextCandidate = naiveUTC - offset;
    if (nextCandidate === candidate) {
      break;
    }
    candidate = nextCandidate;
  }

  const resolved = formatDateParts(candidate, timeZone);
  if (!datePartsEqual(resolved, target)) {
    handleError(
      new Error(`invalid date ${date} ${time} for timezone ${timeZone}`),
      "cannot parse date: %s",
    );
  }

  return Math.floor(candidate / 1000);
}

function parseDateParts(input: string): DateParts {
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/u.exec(
    input,
  );
  if (match === null) {
    throw new Error(`invalid date/time ${input}`);
  }

  const [year, month, day, hour, minute, second] = match.slice(1);

  return {
    year: parseNumberPart(year, "year"),
    month: parseNumberPart(month, "month"),
    day: parseNumberPart(day, "day"),
    hour: parseNumberPart(hour, "hour"),
    minute: parseNumberPart(minute, "minute"),
    second: parseNumberPart(second, "second"),
  };
}

function parseNumberPart(value: string | undefined, label: string): number {
  if (value === undefined) {
    throw new Error(`missing ${label} value`);
  }

  return Number.parseInt(value, 10);
}

function getTimeZoneOffsetMs(timestampMs: number, timeZone: string): number {
  const parts = formatDateParts(timestampMs, timeZone);
  const asUTC = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return asUTC - timestampMs;
}

function formatDateParts(timestampMs: number, timeZone: string): DateParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const entries = formatter.formatToParts(new Date(timestampMs));
  const values = new Map(entries.map((entry) => [entry.type, entry.value]));

  return {
    year: Number.parseInt(values.get("year") ?? "0", 10),
    month: Number.parseInt(values.get("month") ?? "0", 10),
    day: Number.parseInt(values.get("day") ?? "0", 10),
    hour: Number.parseInt(values.get("hour") ?? "0", 10),
    minute: Number.parseInt(values.get("minute") ?? "0", 10),
    second: Number.parseInt(values.get("second") ?? "0", 10),
  };
}

function datePartsEqual(left: DateParts, right: DateParts): boolean {
  return (
    left.year === right.year &&
    left.month === right.month &&
    left.day === right.day &&
    left.hour === right.hour &&
    left.minute === right.minute &&
    left.second === right.second
  );
}

function formatRFC3339Local(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetMinutes);
  const offsetHour = String(Math.floor(absoluteOffset / 60)).padStart(2, "0");
  const offsetMinute = String(absoluteOffset % 60).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${offsetHour}:${offsetMinute}`;
}

function formatCommitDate(commitTS: string): string {
  const timestamp = Number.parseInt(commitTS, 10);
  if (Number.isNaN(timestamp)) {
    return "unknown";
  }

  return new Date(timestamp * 1000).toISOString().slice(0, 10);
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function handleError(error: Error, message: string): never {
  console.error(message.replace("%s", error.message));
  process.exit(1);
}

function printHelp(): void {
  console.log(HELP_TEXT);
}

main();
