import * as dayjsLib from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjsLib.extend(customParseFormat);

export const dayjs = dayjsLib;