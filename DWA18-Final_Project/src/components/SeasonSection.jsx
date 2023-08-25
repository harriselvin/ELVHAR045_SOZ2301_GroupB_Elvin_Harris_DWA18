import React, { useEffect } from 'react';
import { Button, IconButton } from '@mui/material';
import { Rating } from "@mui/material";
import './SeasonSection.css';
import {supabase} from'./utils/utils.js';

const test = async()=>{
    const {data, error} = await supabase.from('favourite').select()
    if(data)console.log(data,'data exist')
    if(error)console.log(error)
}
test()
/**
 * @callback emptyFunction
 */
/**
 * @typedef {object} Props 
 * @prop {string} getSeasonId - is a sting used to fetch the season object
 * @prop {emptyFunction} goBackToShowList
 * @prop {emptyFunction} toggleIsPlaying
 */
/**
 * @param {Props} props 
 * @returns getSeasonId
 */

// Create state with data that will be used
export const SeasonSection =(props)=>{
    const [seasonData, setSeasonData] = React.useState([{}])
    const [individualSeason, setIndividualSeason] = React.useState([{}])
    const [individualSeasonSelected, setIndividualSeasonSelected] = React.useState(false)
    const [favourites, setFavourites] = React.useState([{}])
    const [x,setX] = React.useState(null)
    if(!props.getSeasonId){ // eslint-disable-line
      throw new Error('props.get season does not exist')
    }
    useEffect(()=>{
       const test = async() =>{
        try {
          const data = await supabase.from('favourite').select()  
          console.log(data.data)
          setX(data)
        } catch (error) {
            console.log(error)
        }
        
       }
       test()
    },[])
    console.log(x)
    useEffect(() => {
        const getSeason = async () => {
          try {
            const response = await fetch(`https://podcast-api.netlify.app/id/${props.getSeasonId}`);
            const data = await response.json();
            
            const transformedData = {
              ...data,
              seasons: data.seasons.map((season) => ({
                ...season,
                episodes: season.episodes.map((episode) => ({
                  ...episode,
                  isFavourite: false
                }))
              }))
            };
      
            setSeasonData(transformedData);
            setTimeout(setIsLoading(false),1000)
          } catch (error) {
            console.log('failed to get resources please refresh or come back later');
          }
        }
      
        getSeason();
      }, [props.getSeasonId]);
      
      const toggleIsFaviorite = (episodeId) => {
        setSeasonData((prevSeasonData) => {
          const newSeasonData = { ...prevSeasonData };
          const episode = newSeasonData.seasons[individualSeason.season - 1].episodes[episodeId];
          episode.isFavourite = !episode.isFavourite;
          return newSeasonData;
        });
      };
      const getFavourites = () => { 
        const favoriteEpisodes = seasonData.seasons.flatMap((season) =>
          season.episodes.filter((episode) => episode.isFavourite)
            .map((episode) => ({
              ...episode,
              seasonTitle: season.title,
              seasonImage: season.image,
              seasonNumber: season.season
            }))
        );
      
        
      
        // Filter out episodes that are already favorites
        
        // Update the state with new favorite episodes
        setFavourites((prevFavourites) => [...prevFavourites, ...favoriteEpisodes]);
      };
      
console.log(seasonData)
     const getIndividualSeason =(id)=>{
        const sorted = seasonData.seasons[id-1]
        setIndividualSeason(sorted)
        setIndividualSeasonSelected(true)
     }
    
    console.log(favourites)
    const seasonList = seasonData.seasons && seasonData.seasons.map(( season,index) => {
       return(
         <div key={index} className='season_li' onClick={()=>getIndividualSeason(season.season)}>
            <img src={season.image} />
           <div className='preview_info'> 
           <h3>{season.title} </h3> 
           <p>Episodes: {season.episodes.length}</p> 
          </div>
         </div>
       )
    });
    
  const episodeList = individualSeason.episodes && individualSeason.episodes.map((episode, index) => {
    return (
      <li key={index} className='episode_info'>
        <div>
          <h4>{episode.title}</h4>
          <p className='line-clamp'>{episode.description}</p>
          {episode.isFavourite ? (
            <IconButton onClick={() => toggleIsFaviorite(index)} ><Rating name="size-large" defaultValue={1} size="large" max={1} /></IconButton>
          ) : (
           <IconButton onClick={() => toggleIsFaviorite(index)}><Rating name="size-large" defaultValue={0} size="large" max={1} /></IconButton>
          )}
         <Button  onClick={() => props.toggleIsPlaying(episode.file)}>Play</Button>
        </div>
      </li>
    );
  });
    console.log(seasonData)
    return(
        <>
        <header>
            <div className="navbar">
                <Button  color="error"onClick={props.goBackToShowList}>Back</Button>
                <Button color="error" onClick={props.getFavourites}>Favourite</Button>
            </div>
            <div className="info">
                <img src={seasonData.image}/>
                <h2>{seasonData.title}</h2>
                 <p className='line-clamp '>{seasonData.description}</p>
            </div>
            
        </header>
       {!individualSeasonSelected && <div className='season_ul'>
          <ul className='season_list'>
            {seasonList}
          </ul>
        </div>}
        {individualSeasonSelected && 
        <>
        <div className='episode_list'>
            <Button onClick={()=>setIndividualSeasonSelected(false)}>Back</Button>
            <div className='individual_season_info'>
                <h2>{individualSeason.title}</h2>
                <img src={individualSeason.image}/>
            </div>
            <ul className='season_list'>
              {episodeList}
            </ul>
        </div>
        </>
        }
        
        </>
    )
}