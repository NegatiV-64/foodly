import Box from '@mui/material/Box';
import type { ComponentPropsWithoutRef, FC } from 'react';

export const ContentColumn: FC<ContentColumnProps> = ({ children, sx, ...props }) => {
    return (
        <Box
            component="div"
            height={'100%'}
            display={'flex'}
            flexDirection={'column'}
            gap={2}
            sx={{
                ...sx
            }}
            {...props}
        >
            {children}
        </Box>
    );
};

type ContentColumnProps = ComponentPropsWithoutRef<typeof Box>;