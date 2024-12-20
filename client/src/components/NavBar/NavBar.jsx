import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Stack,
  Menu,
  MenuItem
} from '@mui/material'
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { handleLogOut } from '../../reducers/loginReducer'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import React, { useState } from 'react'

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const user = useSelector((state) => state.login)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logOut = () => {
    dispatch(handleLogOut())
    navigate('/')
  }

  return (

    <AppBar position='static' color='transparent'>
      <Toolbar>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <IconButton size='large' edge='start' color='inherit' aria-label='logo'>
            <CatchingPokemonIcon />
          </IconButton>
        </Link>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Expense Tracker
        </Typography>

        {!user.username ? (
          <Stack direction='row' spacing={2} alignItems="center">
            <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button color='inherit'>Log In</Button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button color='inherit'>
                  Create Account
              </Button>
            </Link>
          </Stack>
        ) : (
          <Stack direction='row' spacing={2} alignItems="center">
            <Button
              color='inherit'
              aria-controls={open ? 'demo-customized-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              endIcon={<KeyboardArrowDownIcon />}
            >
                Transactions</Button>
            <Menu
              MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}>
              <Link to="/transactions/new" style={{ textDecoration: 'none', color: 'inherit' }}>
                <MenuItem onClick={handleClose} disableRipple>
                  New transaction
                </MenuItem>
              </Link>
              <Link to="/transactions" style={{ textDecoration: 'none', color: 'inherit' }}>
                <MenuItem onClick={handleClose} disableRipple>
                  Show all
                </MenuItem>
              </Link>
            </Menu>

            {/*<Link to="/pdfupload" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button color='inherit'>Upload Pdf</Button>
            </Link>*/}
            <Button onClick={logOut} color='inherit'>Log Out</Button>
          </Stack>
        )}

      </Toolbar>
    </AppBar>
  )
}

export default NavBar
