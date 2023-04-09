import { colors } from '@/styles/theme';
import Box from '@mui/material/Box';
import type { ComponentPropsWithoutRef, FC } from 'react';

export const ContentRow: FC<ContentRowProps> = ({ children, sx, ...props }) => {
    return (
        <Box
            component="article"
            py={3}
            px={4}
            bgcolor={colors.gray[900]}
            borderRadius={2}
            sx={{
                ...sx
            }}
            {...props}
        >
            {children}
        </Box>
    );
};

type ContentRowProps = ComponentPropsWithoutRef<typeof Box>;