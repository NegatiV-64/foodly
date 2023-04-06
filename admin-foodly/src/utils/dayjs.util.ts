import dayjs from 'dayjs';
// customParseFormat
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export const Time = dayjs;