import { createTheme } from '@mui/material/styles'

// Central theme shared by MUI and styled-components
export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#a85841',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#fafafa',
            paper: '#ffffff',
        },
    },
    shape: {
        borderRadius: 10,
    },
})

export default theme
