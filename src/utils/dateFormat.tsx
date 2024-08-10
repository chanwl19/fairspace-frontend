const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

export function convertDateToString(inputDate: string): string{
    const date  = new Date(inputDate);
    return days[date.getUTCDay()] + ' ' + date.getUTCDate().toString() + '-'+ (date.getUTCMonth() +1).toString()+'-'+date.getUTCFullYear().toString() + ' ' + (date.getUTCHours().toString()).padStart(2, '0')+':'+(date.getUTCMinutes().toString()).padStart(2,'0');
};