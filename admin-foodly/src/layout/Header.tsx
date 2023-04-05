import { colors } from '@/styles/theme';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

// TODO Pass auth state to this component and use it to display the user's name
export const Header = () => {
    const { bgColor, text } = stringAvatar('Kent Dodds');

    return (
        <Box
            display={'flex'}
            justifyContent={'space-between'}
            p={2}
            bgcolor={colors.slate[900]}
        >
            <Typography variant='h2'>
                <Link href={'/'}>
                    Foodly Admin
                </Link>
            </Typography>
            <Avatar
                sx={{
                    bgcolor: bgColor,
                    color: colors.white
                }}
                color={colors.white}
            >
                {text}
            </Avatar>
        </Box>
    );
};


function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

function stringAvatar(name: string) {
    return {
        bgColor: stringToColor(name),
        text: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}