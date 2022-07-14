import React, { useState, useEffect } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import axios from 'axios'
import {useHref, useLocation, useMatch, useNavigate, useParams, useSearchParams} from 'react-router-dom'

// api за 
// /search/parse_link
// /search/styles

function App() {
  
  const [servicesItem, setServicesItem] = useState('');
  const [brendsItem, setBrendsItem] = useState('');
  const [styleItem, setStyleItem] = useState('');
  
  const [services, setServices] = useState(null);
  const [brends, setBrends] = useState(null);
  const [style, setStyle] = useState(null);
  const navigate = useNavigate()

  const urlAddres = useLocation()





  useEffect(() => {
    axios.get('https://autobooking.com/api/test/v1/search/terms').then(response => {
    const services = response.data
    setServices(services.data)

  })

    axios.get('https://autobooking.com/api/test/v1/search/brands_terms').then(response => {
    const services = response.data
    setBrends(services.data)
  })
    axios.get('https://autobooking.com/api/test/v1/search/styles').then(response => {
    const services = response.data
    setStyle(services.data)

  })
},[]);
  useEffect(() => {
    const services = servicesItem.slug  ? servicesItem.slug : ''
    const brends = brendsItem.slug ? brendsItem.slug : ''
    const style = styleItem.slug ? styleItem.slug : ''
    navigate(`/s-${services}/b-${brends}/st-${style}/`)
},[servicesItem, brendsItem, styleItem, navigate]);
  useEffect(() => {
    console.log('match',urlAddres.pathname);

    const re1 = new RegExp('(\/s-).*?\/');
    const re2 = new RegExp('(\/b-).*?\/');
    const re3 = new RegExp('(\/st-).*?\/');
    const str1 = urlAddres.pathname.match(re1)
    const str2 = urlAddres.pathname.match(re2)
    const str3 = urlAddres.pathname.match(re3)
    console.log('params',str1[0].slice(3,-1),str2[0].slice(3,-1) ,str3[0].slice(4,-1))
    axios
      .get(`https://autobooking.com/api/test/v1/search/parse_link?service_slug=${str1}&brand_slug=${str2}&style_slug=${str3}`)
      .then(response => {})
},[]);

 

  return (
    <List
    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
    component="nav"
    aria-labelledby="nested-list-subheader"
    subheader={
      <ListSubheader component="div" id="nested-list-subheader">
        Nested List Items
      </ListSubheader>
    }
  >

      <ListItem name='Послуги' value={servicesItem.label} items={services} setItem={ setServicesItem } />
      <ListItem name='Бренди' value={brendsItem.label} items={brends} setItem={  setBrendsItem } /> 
      <ListItem name='Стилі' value={styleItem.label} items={style} setItem={  setStyleItem } />
   
      </List>
  );
}



const ListItem = ({ items, value , setItem, name}) => {
  const [open, setOpen] = useState(false);
  
  if (!items) {
    return null
  }

  const handleOpen = () => {
    setOpen(!open);
  };
  const handleClick = (item) => {
    setItem(item)
    setOpen(!open);
  };


  return (
     <>
      <ListSubheader onClick={handleOpen} component="div" id="nested-list-subheader">
        { name }
      </ListSubheader>

    <ListItemButton onClick={handleOpen} >
      <ListItemIcon>
      </ListItemIcon>
      <ListItemText primary={value} />
    </ListItemButton>

    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {items.map(s => {
          return (
            <ListItemButton onClick={() => handleClick(s)} key={s.id} sx={{ pl: 4 }}>
          <ListItemText primary={s.label} />
        </ListItemButton>
          )
        }
        )}
      </List>
    </Collapse>
    </>
  );
 }


export default App
