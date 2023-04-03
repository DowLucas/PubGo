import React, { useState } from 'react';
import { createStyles } from '@mantine/core';
import Login from '../features/auth/Login';

const useStyles = createStyles((theme) => ({
    loginWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
}));

const LoginPage = () => {
    const { classes } = useStyles();

    return (
        <div className={classes.loginWrapper}>
            <Login />
        </div>
    );
};

export default LoginPage;