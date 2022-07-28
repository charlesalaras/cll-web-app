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
import DarkMode from "@mui/icons-material/DarkMode";
import Logo from '../public/logo.svg';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const pages = ["Dashboard", "Assignments", "Performance", "Practice"];

export default function NavBar() {
    return(
	<AppBar position="static">
	  <Container maxWidth="xl">
	  <Toolbar disableGutters>
      <SvgIcon component={Logo}/>
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
	    label={<DarkMode/>}
	    />
	  </Box>
	  <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp"/>
              </IconButton>
	    </Tooltip>
	  </Box>
	  </Toolbar>
	  </Container>
	</AppBar>
    );
}
