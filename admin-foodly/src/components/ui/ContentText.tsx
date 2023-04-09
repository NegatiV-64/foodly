import { colors } from '@/styles/theme';
import Typography from '@mui/material/Typography';
import type { ComponentPropsWithoutRef, FC } from 'react';

export const ContentText: FC<ContentTextProps> = ({ children, sx, ...props }) => {
    return (
        <Typography
            component={'p'}
            fontSize={'18px'}
            fontWeight={500}
            color={colors.white}
            sx={{
                ...sx
            }}
            {...props}
        >
            {children}
        </Typography>
    );
};

type ContentTextProps = ComponentPropsWithoutRef<typeof Typography>;