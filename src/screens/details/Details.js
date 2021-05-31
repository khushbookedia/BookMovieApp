import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import './Details.css'
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import YouTube from 'react-youtube';
import Rating from "@material-ui/lab/Rating";
import StarBorderIcon from "@material-ui/icons/StarBorder";
//import { withStyles } from '@material-ui/core/styles';
import { GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import {useDispatch} from "react-redux";
import { useLocation } from 'react-router-dom';

const useFilterStyles = makeStyles((theme) => ({
    typo: {
        marginBottom: "16px"
    },
}));

const useArtistStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
      margin:"16px"
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    },
    heading : {
        marginBottom: 16,
        marginTop : 16
    }
  }));


    // const StyledRating = withStyles({
    //     iconFilled: {
    //     color: '#ff6d75',
    // },
    // iconHover: {
    // //  color: '#ff3d47',
    //     borderColor: '#ff3d47',
    // },
    // })(Rating);


export default function Details(state){

    const location = useLocation();
    //console.log(location, "location");

    let movieId = state.match.params.id;
    const [movieDetails, setmovieDetails] = useState([]);

    const dispatch = useDispatch();

    useEffect(()=>{
        const getmovieDetails = async () => {
            const response = await fetch("http://localhost:8085/api/v1/movies/" + movieId,{
                method: 'GET'
            });            
            const data = await response.json();
            
            setmovieDetails(data);

            dispatch({"type":"set_movieId", payload:movieId})
        }

        getmovieDetails();
    },[location]);

    
    

    
    const DisplayLeftPart = () => {

        return(     
            <div>
                <img src={movieDetails.poster_url} alt="movie_poster"></img>
            </div>
        )
    }

    const DisplayMiddlePart = ()=> {
        const classes = useFilterStyles();
        const releaseDate = new Date(movieDetails.release_date);
        const videoId = movieDetails.trailer_url.slice(32);
        const opts = {
            height: '390',
            width: '870',
            playerVars: {
              autoplay: 1,
            },
          };

        return(
             
            <div >
                
                 <Typography variant="h5" component="h2" gutterBottom>
                    {movieDetails.title}
                </Typography>

                <Typography> <b>Genre: </b> {movieDetails.genres.join(", ")} </Typography>

                <Typography> <b>Duration: </b> {movieDetails.duration} </Typography>

                <Typography> <b>Release Date: </b> {releaseDate.toDateString()} </Typography>

                <Typography className={classes.typo}> <b>Rating: </b> {movieDetails.rating} </Typography>
                
                <Typography className={classes.typo}> <b>Plot: </b> <a href={movieDetails.wiki_url} target="_blank">(Wiki Link)</a> {movieDetails.storyline} </Typography>

                <Typography> <b>Trailer: </b> </Typography>
                <YouTube opts={opts} videoId={videoId}></YouTube>  
            </div>
        )
    } 

    

    const DisplayRightPart = ()=> {

        let artists= movieDetails.artists;
        const classes = useArtistStyles();
        return(
            <div>
                 <Typography> <b>Rate this movie: </b>  </Typography>
                 <Rating
                    name="customized-empty"
                    defaultValue={0}
                    precision={1}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                 />
                 <Typography className={classes.heading}> <b>Artists: </b>  </Typography>
                 
                 <div className={classes.root}>
                    <GridList 
                        cols={2}
                        cellHeight={300}
                        className={classes.gridList}
                        spacing={10}
                        >
                        {artists.map((tile) => (
                        <GridListTile key={tile.id} >
                            <img src={tile.profile_url} alt={tile.first_name} />
                            <GridListTileBar
                                title={<span>{tile.first_name} &nbsp; {tile.last_name}</span>} 
                                classes={{
                                    root: classes.titleBar,
                                    title: classes.title
                                }}
                            />
                        </GridListTile>
                        ))}  
                    </GridList>
            </div>

            </div>
        )
    }

    if (movieDetails.length < 1) return null;

    return(
        <div>
            <Link to="/"><button className="back-btn"> &lt; Back to Home</button></Link>
            <div className="flex-container">
                <div className="display-left-part"><DisplayLeftPart/></div>
                <div className="display-middle-part"><DisplayMiddlePart/></div>
                <div className="display-right-part"><DisplayRightPart/></div>
             </div>

        </div>
    )
}