import React, { useEffect, useState } from 'react';
import './Home.css';
import { GridList, GridListTile, GridListTileBar, Select } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { FormControl, InputLabel, Input, Checkbox, ListItemText, MenuItem, TextField } from '@material-ui/core';
import {Link} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      flexWrap: "nowrap",
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: "translateZ(0)",
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    },
  }));
  
  const useStylesReleased = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      backgroundColor: theme.palette.background.paper,
      width:"74%",
      margin:"16px"
    },
    title: {
      color: theme.palette.primary.light,
    },
    release_date: {
        color: theme.palette.primary.light,
      },
    titleBar: {
      background:
        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    }
  }));

  const useFilterStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
        maxWidth: 200,
      },
    root: {
      minWidth: 240,
      maxWidth: 240,
      margin: theme.spacing(2),
      textAlign: 'center',
    },
    title: {
      fontSize: 14,
      color: theme.palette.primary.light
    },
    pos: {
      marginBottom: 15,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
      },
}));

const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
          style: {
            maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
            width: 240
          }
        }
    };


export default function Home(props){
    const [tileData, setTileData] = useState([]);
    const [releasedMovies, setReleasedMovies] = useState([]);
    const [getGenres, setGenres] = useState([]);
    const [genreNames, setGenreNames] = useState([]);
    const [getArtists, setArtists] = useState([]);
    const [artistNames, setArtistNames] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);

    let filters = {
        movieName: '',
        genreName: {},
        artistName: {},
        releaseStartDate: '',
        releaseEndDate: ''
    }

    

    useEffect(()=>{
        loadMovies();
        loadReleasedMovies();
        loadGenres();
        loadArtists();
    },[])
    
    const loadMovies = async()=> {

        try{
            const input = await fetch("http://localhost:8085/api/v1/movies?limit=50");
            
            const data = await input.json();
        
            const filteredMovies = data.movies.filter((items)=>{
                return items.status.indexOf("PUBLISHED") > -1
            }); 
            
            setTileData(filteredMovies);
        }
        catch(e){
            alert(`Error: ${e.message}`);
        }
    }
    
    const loadReleasedMovies = async()=> {
        try{
            const response = await fetch("http://localhost:8085/api/v1/movies?limit=50",{
                method: 'GET',
                credentials: 'include',
                withCredentials: true,
                header: new Headers({
                    'Content-Type': 'application/json',
                }),
            });
            const responseData = await response.json();

            const filteredMovies = responseData.movies.filter((items)=>{
                return items.status.indexOf("RELEASED") > -1
            }); 
            setReleasedMovies(filteredMovies);
        }
        catch(e){
            alert(`Error: ${e.message}`);
        }
    }

    const loadGenres = async()=> {
        try{
            const input = await fetch("http://localhost:8085/api/v1/genres",{
                method: 'GET',
                credentials: 'include',
                withCredentials: true,
                header: new Headers({
                    'Content-Type': 'application/json'
                }),
            });
            const data = await input.json();
        
            setGenres(data.genres);
        }
        catch(e){
            alert(`Error: ${e.message}`);
        }
    }

    const loadArtists = async()=> {
        try{
            const input = await fetch("http://localhost:8085/api/v1/artists",{
                method: 'GET',
                credentials: 'include',
                withCredentials: true,
                header: new Headers({
                    'Content-Type': 'application/json'
                }),
            });
            const data = await input.json();
        
            setArtists(data.artists);
        }
        catch(e){
            alert(`Error: ${e.message}`);
        }
    }
    
    
    const DisplayMovies = () =>{
        const classes = useStyles();
        
        return(
            <div className={classes.root}>
                    <GridList className={classes.gridList} cols={6} cellHeight={250}>
                        {tileData.map((tile) => (
                        <GridListTile key={tile.poster_url}>
                            <img src={tile.poster_url} alt={tile.title} />
                            <GridListTileBar
                            title={tile.title}                        
                            classes={{
                                root: classes.titleBar,
                                title: classes.title,
                            }}
                            />
                        </GridListTile>
                        ))}  
                    </GridList>
            </div>
        )
    }

    const DisplayTheatreMovies = ()=> {
        const classes = useStylesReleased();
        const isFilteredMoviesAvailable = filteredItems.length > 0;
        const loopOverArray = isFilteredMoviesAvailable ? [...filteredItems] : [...releasedMovies];
        return(
            <div className={classes.root}>
                    <GridList 
                        cols={4}
                        cellHeight={350}
                        className={classes.gridList}
                        spacing={16}
                        >
                        {loopOverArray.map((tile) => (
                        
                            <GridListTile key={tile.poster_url} style={{width:200}}>
                                <Link to={{
                                    pathname:`/movie/${tile.id}`,
                                    state: {
                                            movie: tile,
                                        }
                                    }}>
                                    <img src={tile.poster_url} alt={tile.title} style={{cursor:'pointer', height:'100%', width:'100%'}}/>
                                    <GridListTileBar
                                        title={tile.title}  
                                        subtitle= {<span>Release Date: {(Date(tile.release_date))}</span>}
                                        classes={{
                                            root: classes.titleBar,
                                            title: classes.title
                                        }}
                                    />
                                </Link>
                            </GridListTile>
                        
                        ))}  
                    </GridList>
            </div>
        )
    }

    
    const handleGenreChange = event => {
        setGenreNames(event.target.value);
    }
    const handleArtistChange = (event) => {
        setArtistNames(event.target.value);
    }

    const handleInputChange = (e)=>{
        filters.movieName = e.target.value;
    }

    const handleStartDate = (e) =>{
    filters.releaseStartDate = e.target.value;
    }

    const handleEndDate = (e) => {
    filters.releaseEndDate = e.target.value;
    }

    function filterHandler() {
        let filteredItems = releasedMovies.slice();
        let result = [];

        if(filters.movieName !== "")
            filteredItems = filteredItems.filter(item => item.title.toLocaleLowerCase() === filters.movieName.toLocaleLowerCase())
        
        
        if(filters.genreName !== {}){
            let genreFilter = [];
            filteredItems.filter(item => {
                
                const genreList = item.genres;

                return genreList.map(eachGenre => {
                    return genreNames.forEach((genre)=>{
                        if(genre === eachGenre && !genreFilter.includes(item)){
                            genreFilter.push(item);
                        }                        
                    })                    
                })           
            })
            if(result.length > 0 && genreFilter.length !== 0){
                const temp =result.slice();
                temp.forEach(item => {
                    if(!genreFilter.includes(item)){
                        const index = result.indexOf(item);
                        if(index > -1){
                            result.splice(index, 1);
                        }   
                    }   
                    filteredItems = result; 
                })
                
            }
            else if(genreFilter.length >0){
                filteredItems = genreFilter;
                result = genreFilter;
            }
        }

        if(filters.artistName !== {}){
            let artistFilter = [];
            filteredItems.filter(item => {
                
                const artistList = item.artists;
               
                return artistList.map(eachArtist => {
                    return artistNames.forEach((artist)=>{
                        if(artist === (eachArtist.first_name + " " + eachArtist.last_name) && !artistFilter.includes(item)){
                            
                            artistFilter.push(item);
                        }
                    })
                })
            })
            if(result.length > 0 && artistFilter.length !== 0){
                const temp =result.slice();
                temp.forEach(item => {
                    if(!artistFilter.includes(item)){
                        const index = result.indexOf(item);
                        if(index > -1){
                            result.splice(index, 1);
                        }   
                    }   
                    filteredItems = result; 
                })
                
            }
            else if(artistFilter.length >0){
                filteredItems = artistFilter;
                result = artistFilter;
            }

        }

        if(filters.releaseStartDate !== ''){
            const d1 = new Date(filters.releaseStartDate);
            filteredItems.filter(item => {
                const d2 = new Date(item.release_date);
                if(+d2 >= +d1 && !result.includes(item)){
                    result.push(item);
                }
                return filteredItems;
            })
            if(result.length > 0)
                    filteredItems = result;
            
        }

        if(filters.releaseEndDate !== ''){
            const d1 = new Date(filters.releaseEndDate);
            filteredItems.filter(item => {
                const d2 = new Date(item.release_date);
                if(+d1 >= +d2 && !result.includes(item)){
                    result.push(item);
                }
                return filteredItems;
            })
            if(result.length > 0)
                    filteredItems = result;
        }

        if(filters.movieName === "" && genreNames.length === 0 && artistNames.length === 0 && filters.releaseStartDate === '' && filters.releaseEndDate === ''){
            loadReleasedMovies();
            filteredItems = releasedMovies;
        }

        setFilteredItems(filteredItems);
    }


    const DisplayFilter = () => {
        const classes = useFilterStyles();
        return(
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                    FIND MOVIES BY:
                    </Typography>
                    <FormControl className={classes.formControl}>
                        
                        <InputLabel htmlFor="movie-name">Movie Name</InputLabel>
                         <Input onChange={handleInputChange} id="movie-name" aria-describedby="movie-name"/>
                         
                    </FormControl>
                    
                    

                    <FormControl className={classes.formControl}>
                        <InputLabel id="genre-names">Genres</InputLabel>
                        <Select
                        labelId="genre-names"
                        id="genre-checkboxes"
                        multiple
                        value={genreNames}
                        onChange={handleGenreChange}
                        input={<Input />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                        >
                        {getGenres.map((name) => (
                            <MenuItem key={name.id} value={name.genre}>
                            <Checkbox checked={getGenres.indexOf(name.genre) > -1} />
                            <ListItemText primary={name.genre} />
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-mutiple-checkbox-label">Artists</InputLabel>
                        <Select
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        multiple
                        value={artistNames}
                        onChange={handleArtistChange}
                        input={<Input />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                        >
                        {getArtists.map((name) => (
                            <MenuItem key={name.id} value={name.first_name + " " + name.last_name}>
                            <Checkbox checked={getArtists.indexOf(name.first_name) > -1} />
                            <ListItemText primary={name.first_name + " " + name.last_name} />
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>

                    <TextField
                            id="release_date_start"
                            label="Release Date Start"
                            type="date"
                            defaultValue="yyyy.MM.dd"
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            margin= 'normal'
                            onChange = {handleStartDate}
                        /> 
                    
                    <TextField
                            id="release_date_end"
                            label="Release Date End"
                            type="date"
                            defaultValue="yyyy.MM.dd"
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            margin= 'normal'
                            onChange = {handleEndDate}
                        /> 

                </CardContent>
                <CardActions>
                    <Button onClick={filterHandler} size="large" style={{background: "#166596", color: "#fff", width: "220px", textAlign:"center"}}>APPLY</Button>
                </CardActions>
            </Card>
        )
    }

    return(
        <div>

             <div className="homeHeading">
                Upcoming Movies
             </div>

             <DisplayMovies/>

             <div className="flex-container">
                <div className="released-movies-container"><DisplayTheatreMovies/></div>
                <div className="filter-container">
                    <DisplayFilter />

                </div>
             </div>
            
             

        </div>
    )
}
