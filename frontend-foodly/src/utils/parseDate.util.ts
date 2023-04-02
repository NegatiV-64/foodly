import dayjs from 'dayjs';
// customParseFormat plugin is required to parse date strings
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export const parseDate = dayjs;