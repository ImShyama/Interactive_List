import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { UserContext } from '../context/UserContext';  import { useNavigate } from "react-router-dom";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";

export default function Navbar() {
  const navigate = useNavigate();
  const { profile, setProfile } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  console.log("profile",profile)
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    googleLogout();
    setProfile(null);
    Cookies.remove('user');
    navigate("/signin")
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Logo
          </Typography>
          {profile ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={() => { handleClose(); logOut(); }}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <p>Signup</p>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
