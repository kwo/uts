package main

import (
	"fmt"
	"os"
	"runtime"
	"slices"
	"strconv"
	"strings"
	"time"
)

//nolint:gochecknoglobals
var (
	commithash = "unknown"
	commitTS   = "unknown"
	version    = "unknown"
)

func main() {
	args := os.Args
	nargs := len(args)

	// print version and exit
	if slices.Contains(args, "--version") {
		if slices.Contains(args, "-v") {
			ts, _ := strconv.ParseInt(commitTS, 10, 64)
			dt := time.Unix(ts, 0).UTC().Format(time.DateOnly)
			fmt.Printf("uts %s %s %s %s\n", version, commithash, dt, runtime.Version())
		} else {
			fmt.Printf("uts %s\n", version)
		}
		return
	}

	if slices.Contains(args, "-h") || slices.Contains(args, "--help") {
		printHelp()
		return
	}

	// if no args, print current unix timestamp and exit
	if nargs == 1 {
		fmt.Printf("%d\n", time.Now().Unix())
		return
	}

	// 1695890808 - parse a unix timestamp
	if nargs == 2 && len(args[1]) < 19 {
		ts, err := strconv.ParseInt(args[1], 10, 64)
		handleError(err, "cannot parse unix timestamp: %s")
		fmt.Println(time.Unix(ts, 1).Format(time.RFC3339))
		return
	}

	// 2023-09-28T10:56:24 - parse datetime in local timezone
	if nargs == 2 && len(args[1]) == 19 {
		ts, err := time.ParseInLocation("2006-01-02T15:04:05", args[1], time.Local)
		handleError(err, "cannot parse datetime: %s")
		fmt.Printf("%d\n", ts.Unix())
		return
	}

	// 2023-09-28T10:56:24Z, 2023-09-28T10:56:24+02:00 - parse datetime in Z or HH:MM
	if nargs == 2 && (len(args[1]) == 20 || len(args[1]) == 25) {
		ts, err := time.Parse(time.RFC3339, args[1])
		handleError(err, "cannot parse datetime: %s")
		fmt.Printf("%d\n", ts.Unix())
		return
	}

	// 2023-09-28 10:56:24 - parse date, time in local time zone
	if nargs == 3 {
		arg := fmt.Sprintf("%s %s", args[1], args[2])
		ts, err := time.ParseInLocation(time.DateTime, arg, time.Local)
		handleError(err, "cannot parse date and time: %s")
		fmt.Printf("%d\n", ts.Unix())
		return
	}

	// 2023-09-28 10:56:24 02:00, 2023-09-28 10:56:24 +02:00, 2023-09-28 10:56:24 -02:00 - parse date, time, tz
	if nargs == 4 && (len(args[3]) == 5 || len(args[3]) == 6) {
		tz := args[3]
		if !strings.HasPrefix(tz, "+") && !strings.HasPrefix(tz, "-") {
			tz = fmt.Sprintf("+%s", tz)
		}
		arg := fmt.Sprintf("%sT%s%s", args[1], args[2], tz)
		ts, err := time.Parse(time.RFC3339, arg)
		handleError(err, "cannot parse date, time, timezone: %s")
		fmt.Printf("%d\n", ts.Unix())
		return
	}

	if nargs == 4 {
		loc, err := time.LoadLocation(args[3])
		handleError(err, "cannot load location: %s")
		arg := fmt.Sprintf("%s %s", args[1], args[2])
		ts, err := time.ParseInLocation(time.DateTime, arg, loc)
		handleError(err, "cannot parse date: %s")
		fmt.Printf("%d\n", ts.Unix())
		return
	}

	printHelp()
	os.Exit(1)
}

func handleError(err error, msg string) {
	if err != nil {
		fmt.Printf(msg, err)
		fmt.Println()
		os.Exit(1)
	}
}

func printHelp() {
	fmt.Println("Usage:")
	fmt.Println("    uts --help                              print help and exit")
	fmt.Println("    uts --version [-v]                      print (extended) version and exit")
	fmt.Println("    uts                                     print current unix timestamp")
	fmt.Println("    uts <unix timestamp>                    parse unix timestamp and print date")
	fmt.Println("    uts <YYYY-MM-DDTHH:MM:SS>               parse datetime in local timezone, print unix timestamp")
	fmt.Println("    uts <YYYY-MM-DDTHH:MM:SSZ>              parse datetime in UTC, print unix timestamp")
	fmt.Println("    uts <YYYY-MM-DDTHH:MM:SS+02:00>         parse datetime with given timezone, print unix timestamp")
	fmt.Println("    uts <YYYY-MM-DD> <HH:MM:SS>             parse date and time and print unix timestamp")
	fmt.Println("    uts <YYYY-MM-DD> <HH:MM:SS> <timezone>  parse date, time, timezone and print unix timestamp")
}
