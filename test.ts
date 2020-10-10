function ReadAlarmRegs () {
  /* extract alarm times and print;; start at minutes */
    serial.writeLine("A1 registers")
    for (let index = 2; index >= 0; index--) {
        alarmReg = DS3231.readReg(8 + index)
        switch(index){
          case 0:
          //serial.writeString("raw minutes: " +  decToHex(alarmReg)+ "\n")
            alarmReg = alarmReg & 0x7f
            serial.writeString("minutes: " +  decToHex(alarmReg))
            break
          case 1:
            alarmReg = alarmReg & 0x3f
            serial.writeString("hours:   "  + decToHex(alarmReg))
            break
          case 2:
            alarmReg = alarmReg & 0x3f
            serial.writeString("date:   " + " " + decToHex(alarmReg))
          
        }
        serial.writeLine(" A1M" + (index + 2) + ": " + (DS3231.readReg(8+index)&0x80)/128+"")
    }
    serial.writeLine("DY bit: " + (DS3231.readReg(10)&0x40)/64+"")
    serial.writeLine("")
    serial.writeLine("A2 registers")
        for (let index = 2; index >= 0; index--) {
        alarmReg = DS3231.readReg(11 + index)
        switch(index){
          case 0:
            //serial.writeString("raw minutes: " +  decToHex(alarmReg)+ "\n")
            alarmReg = alarmReg & 0x7f
            serial.writeString("minutes: " +  decToHex(alarmReg))
            break
          case 1:
            alarmReg = alarmReg & 0x3f
            serial.writeString("hours:   "  + decToHex(alarmReg))
            break
          case 2:
            alarmReg = alarmReg & 0x3f
            serial.writeString("date:   " + " " + decToHex(alarmReg))
          
        }
        serial.writeLine(" A2M" + (index + 2) + ": " + (DS3231.readReg(11+index)&0x80)/128+"")
    }
    serial.writeLine("DY bit: " + (DS3231.readReg(13)&0x40)/64+"")
    serial.writeLine("")
}




function SetAndRead () {
    // Set time, read back
    DS3231.dateTime(
    year,
    month,
    date,
    day,
    hour,
    minute,
    second
    )
    index3 = 1
    if (DS3231.year() != year) {
        serial.writeLine("FAIL year: expect" + year + " read:" + DS3231.year())
    } else {
        serial.writeLine("" + index3 + " PASS")
        index3 += 1
    }
    if (DS3231.month() != month) {
        serial.writeLine("FAIL year: expect" + month + " read:" + DS3231.month())
    } else {
        serial.writeLine("" + index3 + " PASS")
        index3 += 1
    }
    if (DS3231.date() != date) {
        serial.writeLine("FAIL year: expect" + date + " read:" + DS3231.date())
    } else {
        serial.writeLine("" + index3 + " PASS")
        index3 += 1
    }
    if (DS3231.day() != day) {
        serial.writeLine("FAIL year: expect" + day + " read:" + DS3231.day())
    } else {
        serial.writeLine("" + index3 + " PASS")
        index3 += 1
    }
    if (DS3231.hour() != hour) {
        serial.writeLine("FAIL year: expect" + hour + " read:" + DS3231.hour())
    } else {
        serial.writeLine("" + index3 + " PASS")
        index3 += 1
    }
    if (DS3231.minute() != minute) {
        serial.writeLine("FAIL year: expect" + hour + " read:" + DS3231.minute())
    } else {
        serial.writeLine("" + index3 + " PASS")
        index3 += 1
    }
    if (DS3231.second() != second) {
        serial.writeLine("FAIL year: expect" + second + " read:" + DS3231.second())
    } else {
        serial.writeLine("" + index3 + " PASS")
        index3 += 1
    }
}
function decToHex (num: number) {
    result = "0x"
    nibble = Math.floor(num / 16)
    for (let index22 = 0; index22 <= 1; index22++) {
        if (nibble < 10) {
            result = "" + result + convertToText(nibble)
        } else {
            nibble = nibble - 10
            result = "" + result + "abcdef".charAt(nibble)
        }
        nibble = num % 16
    }
    return result
}
let nibble = 0
let result = ""
let index3 = 0
let alarmReg = 0
let second = 0
let minute = 0
let hour = 0
let day = 0
let date = 0
let month = 0
let year = 0
basic.showIcon(IconNames.Asleep)
serial.writeLine("")
serial.writeLine("TEST1 - set and read back time registers")
year = 2007
month = 9
date = 26
day = 1
hour = 23
minute = 7
second = 58
SetAndRead()
serial.writeLine("TEST2 - set and read back time registers")
year = 2018
month = 12
date = 9
day = 6
hour = 8
minute = 58
second = 7
SetAndRead()
// Alarm tests
serial.writeLine("")
serial.writeLine("TEST3 - set & read alarm, Minute mode at (1) :07, (2) 33")
date = 30
day = 2
hour = 23
minute = 7
DS3231.setAlarm(alarmNum.A1,mode.Minute,date,day,hour,minute)
//
date = 9
day = 7
hour = 8
minute = 33
DS3231.setAlarm(alarmNum.A2,mode.Minute,date,day,hour,minute)
ReadAlarmRegs()
//
serial.writeLine("TEST4 - set & read alarm, HourMinute mode at (1) 23:08, (2) 8:43")
date = 30
day = 2
hour = 23
minute = 8
DS3231.setAlarm(alarmNum.A1,mode.HourMinute,date,day,hour,minute)
//
date = 9
day = 7
hour = 8
minute = 43
DS3231.setAlarm(alarmNum.A2,mode.HourMinute,date,day,hour,minute)
ReadAlarmRegs()
//
serial.writeLine("TEST5 - set & read alarm, DayHourMinute mode at (1) 2 23:17, (2) 7 18:53")
date = 30
day = 2
hour = 23
minute = 17
DS3231.setAlarm(alarmNum.A1,mode.DayHourMinute,date,day,hour,minute)
date = 9
day = 7
hour = 18
minute = 53
DS3231.setAlarm(alarmNum.A2,mode.DayHourMinute,date,day,hour,minute)
ReadAlarmRegs()
//
serial.writeLine("TEST6 - set & read alarm, DateHourMinute mode at (1) 30 23:20, (2) 9 23:58")
date = 30
day = 2
hour = 23
minute = 20
DS3231.setAlarm(alarmNum.A1,mode.DateHourMinute,date,day,hour,minute)
//
date = 9
day = 7
hour = 23
minute = 58
DS3231.setAlarm(alarmNum.A2,mode.DateHourMinute, date,day,hour,minute)
ReadAlarmRegs()
//
serial.writeLine("TESTS COMPLETED!")
basic.showIcon(IconNames.Happy)
