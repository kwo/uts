# UTS Unix Timestamp

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

```sh
uts
1696283053
```

```sh
uts 1696283053
2023-10-02T23:44:13+02:00
```

```sh
uts 2023-10-02T23:44:13
1696283053
```

```sh
uts 2023-10-02T21:44:13Z
1696283053
```

```sh
uts 2023-10-02T23:44:13+02:00
1696283053
```

```sh
uts 2023-10-02 23:44:13
1696283053
```

```sh
uts 2023-10-02 23:44:13 02:00
1696283053
```

```sh
uts 2023-10-02 14:44:13 -07:00
1696283053
```

```sh
uts 2023-10-02 23:44:13 Europe/Berlin
1696283053
```


## Installation (MacOS only)

```sh
brew install kwo/tools/uts
```
