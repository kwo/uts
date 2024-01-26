# UTS Unix Timestamp

`uts` is a tool to convert dates to unix timestamps and back. It compiles to a static binary without external dependencies and includes its own timezone database making it a perfect tool for minimal installations.

## Usage

```md
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

Print the current unix timestamp.
```sh
uts
1696283053
```

Parse the given unix timestamp.
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


## Installation (MacOS only)

```sh
brew install kwo/tools/uts
```
