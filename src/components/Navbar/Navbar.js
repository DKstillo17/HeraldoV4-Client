import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

import logoHeraldo from '../../images/el-heraldo-logo.svg';
import * as actionType from '../../constants/actionTypes';
import useStyles from './styles';
import { getPostsBySearch } from '../../actions/posts';
import Posts from '../Posts/Posts';

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const [search, setSearch] = useState('');

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });

    history.push('/auth');

    setUser(null);
  };

  const searchPost = () => {
    if (search.trim()) {
      dispatch(getPostsBySearch({ search }));
      history.push(`/posts/search?searchQuery=${search}`);
    } else {
      history.push('/');
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
    }
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
                </div>
                <InputBase onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKeyPress}
                  name="search"
                  value={search}
                  placeholder="Buscar"
                  classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
      <Link to="/" className={classes.brandContainer}>
        <img component={Link} to="/" src={logoHeraldo} alt="icon" height="45px" />
      </Link>
      <Toolbar className={classes.toolbar}>
        {user?.result ? (
          <div className={classes.profile}>
            <Avatar className={classes.purple} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>
            <Typography className={classes.userName} variant="h6">{user?.result.name}</Typography>
            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Cerrar sesión</Button>
          </div>
        ) : (
          <Button component={Link} to="/auth" variant="contained" color="primary">Iniciar sesión</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
