import { useAuth } from '@/contexts/auth/auth.context';
import { colors } from '@/styles/theme';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { Fragment, useMemo, useRef, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { LogoutRounded } from '@mui/icons-material';

// TODO Pass auth state to this component and use it to display the user's name
export const Header = () => {
    const { user, onLogout } = useAuth();
    const { bgColor, text } = useMemo(() => stringAvatar(user?.user_fullname || 'Test User'), [user?.user_fullname]);

    const accountAvatarRef = useRef<HTMLDivElement | null>(null);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    function closeAccountMenu() {
        setShowAccountMenu(false);
    }
    function openAccountMenu() {
        setShowAccountMenu(true);
    }

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
            {
                user && (
                    <Fragment>
                        <Tooltip title={user.user_fullname}>
                            <Avatar
                                onClick={openAccountMenu}
                                ref={accountAvatarRef}
                                sx={{
                                    bgcolor: bgColor,
                                    color: colors.white
                                }}
                            >
                                {text}
                            </Avatar>
                        </Tooltip>
                        <Menu
                            PaperProps={{
                                sx: {
                                    bgcolor: colors.clay[950]
                                }
                            }}
                            open={showAccountMenu}
                            anchorEl={accountAvatarRef.current}
                            onClose={closeAccountMenu}
                            onClick={closeAccountMenu}
                        >
                            <MenuItem sx={{ fontSize: 18 }}>
                                <Link href={'/account'}>
                                    Account
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={onLogout} sx={{ fontSize: 18 }}>
                                <LogoutRounded fontSize={'small'} sx={{marginRight: '2px'}} />
                                Logout
                            </MenuItem>
                        </Menu>
                    </Fragment>
                )
            }
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