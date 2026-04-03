# UTS Unix Timestamp

`uts` is a TypeScript CLI that converts dates to Unix timestamps and back. The build produces a single bundled Node.js executable script.

## Requirements

- Node.js 22+

## Usage

```text
Usage:
    uts --help                              print help and exit
    uts --version [-v]                      print (extended) version and exit
    uts                                     print current unix timestamp
    uts <unix timestamp>                    parse unix timestamp and print date
    uts <YYYY-MM-DDTHH:MM:SS>               parse datetime in local timezone, print unix timestamp
    uts <YYYY-MM-DDTHH:MM:SSZ>              parse datetime in UTC, print unix timestamp
    uts <YYYY-MM-DDTHH:MM:SS+02:00>         parse datetime with given timezone, print unix timestamp
    uts <YYYY-MM-DD> <HH:MM:SS>             parse date and time and print unix timestamp
    uts <YYYY-MM-DD> <HH:MM:SS> <timezone>  parse date, time, timezone and print unix timestamp
```

## Examples

Print the current Unix timestamp.

```sh
uts
1696283053
```

Parse the given Unix timestamp.

```sh
uts 1696283053
2023-10-02T23:44:13+02:00
```

Parse the given date using the local timezone.

```sh
uts 2023-10-02T23:44:13
1696283053
```

Parse the given date using the UTC timezone.

```sh
uts 2023-10-02T21:44:13Z
1696283053
```

Parse the given date using a timezone offset.

```sh
uts 2023-10-02T23:44:13+02:00
1696283053
```

Parse the date and time, given as two separate arguments, using the local timezone.

```sh
uts 2023-10-02 23:44:13
1696283053
```

Parse the date and time using a timezone offset.

```sh
uts 2023-10-02 23:44:13 02:00
1696283053
```

Parse the date and time using a timezone offset.

```sh
uts 2023-10-02 14:44:13 -07:00
1696283053
```

Parse the date and time using a named timezone.

```sh
uts 2023-10-02 23:44:13 Europe/Berlin
1696283053
```

## Development

```sh
npm install
npm run build
npm run lint
```

The build uses esbuild to bundle the CLI into `dist/uts` with a Node shebang.

## Installation (macOS only)

```sh
brew install kwo/tools/uts
```

Homebrew installs the bundled CLI and declares a `node` dependency.
