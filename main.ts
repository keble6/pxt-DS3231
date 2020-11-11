/**
* makecode DS3231 RTC Package.
* Based on DS1307 package from https://github.com/makecode-extensions/DS1307
*/

// enums to choose alarm number etc - these must be outside the namespace!
enum alarmNum {
    A1,
    A2
}

enum mode {
  Minute,
  HourMinute,
  DateHourMinute,
  DayHourMinute
}

enum interruptEnable {
  Enable,
  Disable
}


/**
 * DS3231 block
 */
//% weight=20 color=#b77ff0 icon="\uf017" block="DS3231"
namespace DS3231 {
    let DS3231_I2C_ADDR =     0x68
    let DS3231_REG_SECOND =   0x00
    let DS3231_REG_MINUTE =   0x01
    let DS3231_REG_HOUR =     0x02
    let DS3231_REG_DAY  =     0x03
    let DS3231_REG_DATE =     0x04
    let DS3231_REG_MONTH =    0x05
    let DS3231_REG_YEAR =     0x06
    let DS3231_REG_A1BASE =   0x08
    let DS3231_REG_A2BASE =   0x0b
    let DS3231_REG_CTRL =     0x0e
    let DS3231_REG_STATUS  =  0x0f
    let DS3231_REG_TEMPU  =   0x11
    let DS3231_REG_TEMPL  =   0x12
    
    
    /**
     * set a DS3231 reg
     */
    function setReg(reg: number, dat: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(DS3231_I2C_ADDR, buf);
    }

    /**
     * get a DS3231 reg value
     */
    function regValue(reg: number){
        pins.i2cWriteNumber(DS3231_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(DS3231_I2C_ADDR, NumberFormat.UInt8BE);
    }

    /**
     * convert Bcd to Dec
     */
    function bcdToDec(bcd: number){
        return (bcd >> 4) * 10 + (bcd % 16);
    }

    /**
     * convert Dec to Bcd
     */
    function decToBcd(dec: number){
        return Math.idiv(dec, 10) * 16 + (dec % 10)
    }


    /**
     * get Year
     */
    //% blockId="DS3231_GET_YEAR" block="year"
    //% weight=99 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function year(){
        return Math.min(bcdToDec(regValue(DS3231_REG_YEAR)), 99) + 2000
    }

    /**
     * get Month
     */
    //% blockId="DS3231_GET_MONTH" block="month"
    //% weight=98 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function month() {
        return Math.max(Math.min(bcdToDec(regValue(DS3231_REG_MONTH)), 12), 1)
    }

    /**
     * get Date
     */
    //% blockId="DS3231_GET_DATE" block="date"
    //% weight=97 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function date() {
        return Math.max(Math.min(bcdToDec(regValue(DS3231_REG_DATE)), 31), 1)
    }


    /**
     * get (Week) Day
     */
    //% blockId="DS3231_GET_DAY" block="day"
    //% weight=96 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function day(){
        return Math.max(Math.min(bcdToDec(regValue(DS3231_REG_DAY)), 7), 1)
    }


    /**
     * get Hour
     */
    //% blockId="DS3231_GET_HOUR" block="hour"
    //% weight=95 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function hour() {
        return Math.min(bcdToDec(regValue(DS3231_REG_HOUR)), 23)
    }


    /**
     * get Minute
     */
    //% blockId="DS3231_GET_MINUTE" block="minute"
    //% weight=94 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function minute() {
        return Math.min(bcdToDec(regValue(DS3231_REG_MINUTE)), 59)
    }


    /**
     * get Second
     */
    //% blockId="DS3231_GET_SECOND" block="second"
    //% weight=93 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function second() {
        return Math.min(bcdToDec(regValue(DS3231_REG_SECOND)), 59)
    }
    /**
     *  get status register
     */
    //% blockId="DS3231_GET_STATUS" block="status"
    //% weight=90 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function status() {
        return (regValue(DS3231_REG_STATUS))
    }

    /**
     *  get control register
     */
    //% blockId="DS3231_GET_CONTROL" block="control"
    //% weight=88 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function control(){
        return (regValue(DS3231_REG_CTRL))
    }

    /**
     *  get temperature upper register
     */
    //% blockId="DS3231_GET_TEMPU" block="temperature (upper)"
    //% weight=86 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function temperatureUpper() {
        return (regValue(DS3231_REG_TEMPU))
    }

    /**
     *  get temperature lower register
     */
    //% blockId="DS3231_GET_TEMPL" block="temperature (lower)"
    //% weight=84 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function temperatureLower(){
        return (regValue(DS3231_REG_TEMPL))
    }

    /**
     * set Date and Time
     * @param year is the Year  to be set, eg: 2020
     * @param month is the Month  to be set, eg: 2
     * @param date is the Date  to be set, eg: 15
     * @param day is the day (of the week) to be set, eg: 4
     * @param hour is the Hour  to be set, eg: 0
     * @param minute is the Minute to be set, eg: 0
     * @param second is the Second to be set, eg: 0
     */
    //% blockId="DS3231_SET_DATETIME" block="set year %year|month %month|date %date|day %day|hour %hour|minute %minute|second %second"
    //% year.min=2000 year.max=2099
    //% month.min=1   month.max=12
    //% date.min=1    date.max=31
    //% day.min=1     day.max=7
    //% hour.min=0    hour.max=23
    //% minute.min=0  minute.max=59
    //% second.min=0  second.max=59
    //% weight=60 blockGap
    //% parts=DS3231 trackArgs=0
    export function dateTime(year: number, month: number, date: number, day: number, hour: number, minute: number, second: number){
        let buf = pins.createBuffer(8);
        buf[0] = DS3231_REG_SECOND;
        buf[1] = decToBcd(second);
        buf[2] = decToBcd(minute);
        buf[3] = decToBcd(hour);
        buf[4] = decToBcd(day);
        buf[5] = decToBcd(date);
        buf[6] = decToBcd(month);
        buf[7] = decToBcd(year-2000);//bug fix, notified by pull req from mworkfun
        pins.i2cWriteBuffer(DS3231_I2C_ADDR, buf)
    }
    
    
    /**
     * set Alarm mode and time registers for alarm An (n = 1 or 2)
     * @param modeAn is the matching mode for An eg:hour minute
     * @param interruptAn is the interrup enable for An eg: on
     * @param name is the Alarm name (A1 or A2)
     * @param date is the Date  to be set, eg: 15
     * @param day is the day (of the week)  to be set, eg: 4
     * @param hour is the Hour  to be set, eg: 13
     * @param minute is the Minute to be set, eg: 0
     */
    //% blockId="DS3231_ALARM" block="set alarm %name| mode %modeAn| date %date|day %day|hour %hour|minute %minute"
    //% date.min=1    date.max=31
    //% day.min=1     day.max=7
    //% hour.min=0    hour.max=23
    //% minute.min=0  minute.max=59
    //% weight=58 blockGap
    //% parts=DS3231 trackArgs=0
    export function setAlarm(name: alarmNum, modeAn: mode, date: number, day: number, hour: number, minute: number) {
        let buf = pins.createBuffer(4)
        buf[1] = decToBcd(minute)  //raw minutes, before AnM2 is set
        buf[2] = decToBcd(hour)    //raw hours before AnM3 is set
        buf[3] = decToBcd(date)
        switch(name) {
            case alarmNum.A1: buf[0] = DS3231_REG_A1BASE
                break
            case alarmNum.A2: buf[0] = DS3231_REG_A2BASE
        }
        
        switch(modeAn){
            case mode.Minute: {
                buf[3] = buf[3] | 0x80 //set AnM4
                buf[2] = buf[2] | 0x80 //set AnM3
                break
            }
            case mode.HourMinute: {
                buf[3] = buf[3] | 0x80 //set AnM4
                break
            }
            case mode.DateHourMinute: {
                buf[3] = decToBcd(date)
                break
            }
            case mode.DayHourMinute: {
              buf[3] = decToBcd(day)
              buf[3] = buf[3] | 0x40 //set DY bit
            }
        }
        pins.i2cWriteBuffer(DS3231_I2C_ADDR, buf)

    }

/**
     * alarm interrupt enable An (1 or 2)
     * @param name is the Alarm name (A1 or A2)
     * @param mode is Enable or Disable
     */
    //% blockId="DS3231_ALARM_INTERRUPT_ENABLE" block="alarm interrupt enable  %name |%mode"
    //% weight=56 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function disableAlarm(name: alarmNum, mode: interruptEnable){
        let control = regValue(DS3231_REG_CTRL)
        switch(name) {
            case alarmNum.A1:
                switch(mode){
                    case interruptEnable.Enable: setReg(DS3231_REG_CTRL, control | 0x01)
                    break
                    case interruptEnable.Disable: setReg(DS3231_REG_CTRL, control & 0xfe)
                }
                break
            case alarmNum.A2: setReg(DS3231_REG_CTRL, control & 0xfd)
                switch(mode) {
                    case interruptEnable.Enable: setReg(DS3231_REG_CTRL, control | 0x02)
                    break
                    case interruptEnable.Disable: setReg(DS3231_REG_CTRL, control & 0xfd)
                }
        }
    }

    /**
     * clear alarm flag An (n = 1 or 2)
     * @param name is the Alarm name (A1 or A2)
     */
    //% blockId="DS3231_CLEAR_ALARM_FLAG" block="clear alarm flag %name"
    //% weight=52 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function clearAlarmFlag(name: alarmNum){
        let reg = regValue(DS3231_REG_STATUS)
        switch(name) {
            case alarmNum.A1: setReg(DS3231_REG_STATUS, reg & 0xfe)
                break
            case alarmNum.A2: setReg(DS3231_REG_STATUS, reg & 0xfd)
        }
    }

    /**
     * configure INTCN
     * @param name is the Alarm name (A1 or A2)
     */
    //% blockId="DS3231_CONFIG_INTCN" block="configure INTCN %mode"
    //% weight=50 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function configureINTCN(mode: interruptEnable){
        let control = regValue(DS3231_REG_CTRL)
        switch(mode){
            case interruptEnable.Enable:  control = control | 0x04 //set b2
            break
            case interruptEnable.Disable: control = control & 0xfb //reset b2
        }
        setReg(DS3231_REG_CTRL, control)
    }

    /**
     * read any register - for DEBUG only
     */
    //% blockId="DS3231_GET_ANYREG" block="read register %reg"
    //% weight=48 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function readReg(reg: number) {
        return (regValue(reg))
    }
}
//
