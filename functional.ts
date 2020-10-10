function TwosCompToDec (num: number) {
    if (num > 127) {
        return num - 256
    } else {
        return num
    }
}
function Log () {
    serial.writeString("" + DS3231.year() + "/" + DS3231.month() + "/" + DS3231.date() + " ")
    serial.writeString("" + DS3231.hour() + ":" + DS3231.minute() + ":" + DS3231.second() + " ")
    serial.writeString("Control: " + decToHex(DS3231.control()))
    serial.writeString(" Status: " + decToHex(DS3231.status()))
    serial.writeString(" INT pin: " + pins.digitalReadPin(DigitalPin.P0))
    serial.writeLine("")
}
function decToHex (num: number) {
    result = "0x"
    nibble = Math.floor(num / 16)
    for (let index = 0; index <= 1; index++) {
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
serial.writeLine("FUNCTIONAL TEST 1 Temperature reading")
serial.writeLine("Temperature: " + TwosCompToDec(DS3231.temperatureUpper()) + "." + Math.floor(DS3231.temperatureLower() / 64) * 25)
serial.writeLine("")

//
serial.writeLine("FUNCTIONAL TEST 2 Alarm function")
DS3231.configureINTCN(interruptEnable.Enable)
DS3231.clearAlarmFlag(alarmNum.A1)
DS3231.clearAlarmFlag(alarmNum.A2)
DS3231.disableAlarm(alarmNum.A1, interruptEnable.Enable)
DS3231.disableAlarm(alarmNum.A2, interruptEnable.Enable)
//
let alarmHour = 20
let alarmMinute = 12
DS3231.dateTime(DS3231.year(),DS3231.month(),DS3231.date(),DS3231.day(),alarmHour,alarmMinute - 1,0)
DS3231.setAlarm(alarmNum.A1,mode.Minute,DS3231.date(),DS3231.day(),alarmHour,alarmMinute)
DS3231.setAlarm(alarmNum.A2,mode.Minute,DS3231.date(),DS3231.day(),alarmHour,alarmMinute + 1)
//
serial.writeLine("Alarm 1 set to: " + convertToText(alarmHour) + ":" + alarmMinute)
serial.writeLine("Alarm 2 set to: " + convertToText(alarmHour) + ":" + (alarmMinute + 1))
for (let index = 0; index <= 13; index++) {
    Log()
    if (DS3231.status() == 137 && pins.digitalReadPin(DigitalPin.P0) == 0) {
        serial.writeLine("Alarm 1 triggered and reset")
        DS3231.clearAlarmFlag(alarmNum.A1)
    }
    if (DS3231.status() == 138 && pins.digitalReadPin(DigitalPin.P0) == 0) {
        serial.writeLine("Alarm 2 triggered and reset")
        DS3231.clearAlarmFlag(alarmNum.A2)
    }
    basic.pause(10000)
}
serial.writeLine("TESTS COMPLETED")
