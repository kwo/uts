# UTS Unix Timestamp

## Usage

```
Usage:  
    uts                                    - print current unix timestamp  
    uts <unix timestamp>                   - parse unix timestamp and print date  
    uts <YYYY-MM-DDTHH:MM:SS>              - parse datetime in local timezone, print unix timestamp  
    uts <YYYY-MM-DDTHH:MM:SSZ>             - parse datetime in UTC, print unix timestamp  
    uts <YYYY-MM-DDTHH:MM:SS+02:00>        - parse datetime with given timezone, print unix timestamp  
    uts <YYYY-MM-DD> <HH:MM:SS>            - parse date and time and print unix timestamp  
    uts <YYYY-MM-DD> <HH:MM:SS> <timezone> - parse date, time, timezone and print unix timestamp  
```

## Installation

```sh
brew install kwo/tools/uts
```
