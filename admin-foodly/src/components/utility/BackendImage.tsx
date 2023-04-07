import { BACKEND_URL } from '@/config/env.config';
import Image from 'next/image';
import type { ComponentPropsWithoutRef, FC } from 'react';

export const BackendImage: FC<BackendImageProps> = ({ src, alt, ...props }) => {
    return (
        <Image
            src={constructPathToImage(src)}
            alt={alt}
            {...props}
        />
    );
};

function constructPathToImage(imageName: string) {
    return `${BACKEND_URL}/${imageName}`;
}

type BackendImageProps = Omit<ComponentPropsWithoutRef<typeof Image>, 'src'> & {
    src: string;
};
