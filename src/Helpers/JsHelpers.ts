export class JsHelpers {
    static addSecondsToDate(date:Date, seconds:number) :Date {
        return new Date(date.getTime() + seconds * 1000);
    }

    static newGuid() :string {
        function _p8(s: boolean) :string {  
           var p = (Math.random().toString(16)+"000000000").substring(2,8);
           return s ? "-" + p.substring(0,4) + "-" + p.substring(4,4) : p ;
        }  
        return _p8(false) + _p8(true) + _p8(true) + _p8(false);
    }
}


export function dateToStringHhMmSs(date) {
    return alwaysTwoDigits(date.getHours()) + ":" + alwaysTwoDigits(date.getMinutes()) + ":" + alwaysTwoDigits(date.getSeconds());
}

function alwaysTwoDigits(n) {
    return n < 10 ? "0" + n : n;
}