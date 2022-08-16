import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import { useSession, signOut } from 'next-auth/react';

const pages = ["Dashboard", "Assignments", "Performance", "Practice"];

export default function NavBar() {
    const { data: session } = useSession();
    return(
	<AppBar position="static">
	  <Container maxWidth="x1">
	  <Toolbar disableGutters>
	  <Typography
	   variant="h6"
	   noWrap
	   component="a"
	   href="/"
	   sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
	   }}
	  >
	  CALIFORNIA LEARNING LABS
	  </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
	  <Box sx={{ flexGrow: 0 }}>
	    <FormControlLabel
	    control={<Switch color="default"/>}
	    label="Light/Dark Mode"
	    />
	  </Box>
	  <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={session === undefined ?  "" : String(session.user.image)}/>
              </IconButton>
	    </Tooltip>
	  </Box>
	  </Toolbar>
	  </Container>
	</AppBar>
    );
}
