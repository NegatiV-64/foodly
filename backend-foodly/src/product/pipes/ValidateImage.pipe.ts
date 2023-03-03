import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';

export const ValidateImage = (isFileRequred = true) => {
    return new ParseFilePipe({
        fileIsRequired: isFileRequred,
        errorHttpStatusCode: 400,
        validators: [
            new MaxFileSizeValidator({
                maxSize: 10 * 1024 * 1024,
            }),
            new FileTypeValidator({
                fileType: new RegExp(/(png|jpg|jpeg)$/)
            })
        ],
    });
};