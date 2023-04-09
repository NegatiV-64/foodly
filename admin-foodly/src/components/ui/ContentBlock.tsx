import { colors } from '@/styles/theme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';

export const ContentBlock: FC<ContentBlockProps> = ({ children, sx, title, ...props }) => {
    return (
        <Box
            component="div"
            height={'100%'}
            sx={{
                ...sx
            }}
            {...props}
        >
            <Typography
                component={'h3'}
                fontSize={'18px'}
                fontWeight={500}
                color={colors.gray[400]}
            >
                {title}
            </Typography>
            {children}
        </Box>
    );
};

type ContentBlockProps = Omit<ComponentPropsWithoutRef<typeof Box>, 'title'> & {
    title: ReactNode;
};