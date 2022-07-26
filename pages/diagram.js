import React from "react";
//import "./styles.css";
import data from "./data.json";
import SankeyChart from "./SankeyChart";
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


const dimensions = {
  width: 1200,
  height: 800,
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60
  }
};

const pages = ["Dashboard", "Assignments", "Performance", "Practice"];

export default function Diagram() {
  return (
    <main>
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
                <Avatar alt="Remy Sharp"/>
              </IconButton>
	    </Tooltip>
	  </Box>
	  </Toolbar>
	  </Container>
	</AppBar>
    <div className="Diagram">
      <SankeyChart data={data} dimensions={dimensions} />
    </div>
    </main>
  );
}