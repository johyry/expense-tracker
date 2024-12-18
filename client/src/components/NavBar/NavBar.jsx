import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Stack,
} from '@mui/material'
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { handleLogOut } from '../../reducers/loginReducer'

const NavBar = () => {
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
              <Button color='inherit'>Create Cccount</Button>
            </Link>
          </Stack>
        ) : (
          <Stack direction='row' spacing={2} alignItems="center">
            <Link to="/transactions" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button color='inherit'>Transactions</Button>
            </Link>
            <Link to="/pdfupload" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button color='inherit'>Upload Pdf</Button>
            </Link>
            <Button onClick={logOut} color='inherit'>Log Out</Button>
          </Stack>
        )}

      </Toolbar>
    </AppBar>
  )
}

export default NavBar
