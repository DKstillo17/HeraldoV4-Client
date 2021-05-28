import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, InputLabel, Select, MenuItem, FormControl } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useHistory } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

import { createPost, updatePost } from '../../actions/posts';
import useStyles from './styles';

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ title: '',description: '',resume: '',category: '',autor: '',tags: [] ,selectedFile: '' });
  const post = useSelector((state) => (currentId ? state.posts.posts.find((description) => description._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '',description: '',resume: '',category: '',autor: '',tags: [] ,selectedFile: '' });
  };

  useEffect(() => {
    if (!post?.title) clear();
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createPost({ ...postData, name: user?.result?.name }, history));
      clear();
    } else {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
      clear();
    }
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper} elevation={6}>
        <Typography variant="h6" align="center">
          Por favor inicia sesión para poder crear una noticia.
        </Typography>
      </Paper>
    );
  }

  const handleAddChip = (tag) => {
    setPostData({ ...postData, tags: [...postData.tags, tag] });
  };

  const handleDeleteChip = (chipToDelete) => {
    setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== chipToDelete) });
  };

  return (
    <Paper className={classes.paper} elevation={6}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? `Editando "${post.title}"` : 'Crear noticia'}</Typography>
        <TextField inputProps={{ maxLength: 200 }} className={classes.fileInput} name="title" variant="outlined" label="Titulo" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })}/>
        <TextField multiline rows={4} name="description" variant="outlined" label="Descripción" fullWidth value={postData.description} onChange={(e) => setPostData({ ...postData, description: e.target.value })}/>
        <TextField inputProps={{ maxLength: 700 }} multiline rows={2} name="resume" variant="outlined" label="Resumen" fullWidth value={postData.resume} onChange={(e) => setPostData({ ...postData, resume: e.target.value })}/>
        <FormControl variant="outlined" fullWidth className={classes.fileInput}>
          <InputLabel id="label-category">Categoria</InputLabel>
            <Select labelId="label-category" id="demo-simple-select-outlined" value={postData.category} onChange={(e) => setPostData({ ...postData, category: e.target.value })} label="Categoria">
              <MenuItem value="Locales">Locales</MenuItem>
              <MenuItem value="Política">Política</MenuItem>
              <MenuItem value="Economía">Economía</MenuItem>
              <MenuItem value="Deportes">Deportes</MenuItem>
            </Select>
        </FormControl>
        <TextField inputProps={{ maxLength: 30 }} name="autor" variant="outlined" label="Autor" fullWidth value={postData.autor} onChange={(e) => setPostData({ ...postData, autor: e.target.value })}/>
        <TextField name="tags" variant="outlined" label="Etiqueta" fullWidth value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })}/>
        {/*<div style={{ padding: '5px 0', width: '94%' }}>
          <ChipInput
            name="tags"
            variant="outlined"
            label="Tags"
            fullWidth
            value={postData.tags}
            onAdd={(chip) => handleAddChip(chip)}
            onDelete={(chip) => handleDeleteChip(chip)}
          />
  </div>*/}
        <div className={classes.fileInput}><FileBase type="file"multiple={false}onDone={({base64})=> setPostData({...postData, selectedFile: base64})}/></div>
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>{currentId ? `Guardar cambios` : 'Publicar'}</Button>
        <Button variant="contained" color="secondary" size="large" onClick={clear} fullWidth>Limpiar</Button>
      </form>
    </Paper>
  );
};

export default Form;
