import type { ComponentPropsWithoutRef, FC } from 'react';
import { Image } from 'react-native';
import { BACKEND_URL } from '../../config/env.config';

export const BackendImage: FC<BackendImageProps> = ({ source, ...props }) => {
    return (
        <Image
            source={{
                uri: getBackendUrl(source)
            }}
            {...props}
        />
    );
};

type BackendImageProps = Omit<ComponentPropsWithoutRef<typeof Image>, 'source'> & {
    source: string;
};

function getBackendUrl(path: string): string {
    return `${BACKEND_URL}/${path}`;
}