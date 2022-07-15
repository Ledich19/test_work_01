import React, { useState, useEffect } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import axios from 'axios'
import { useLocation,  useNavigate } from 'react-router-dom'
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';



function App() {
  
  const [servicesItem, setServicesItem] = useState('');
  const [brendsItem, setBrendItem] = useState('');
  const [styleItem, setStyleItem] = useState('');
  
  const [services, setServices] = useState(null);
  const [brends, setBrends] = useState(null);
  const [style, setStyle] = useState(null);

 
  const urlAddres = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('https://onboarding.art-code.team/api/test/v1/search/terms').then(response => {
    const services = response.data
    setServices(services.data)
  })
    axios.get('https://onboarding.art-code.team/api/test/v1/search/brands_terms').then(response => {
    const services = response.data
    setBrends(services.data)
  })
    axios.get('https://onboarding.art-code.team/api/test/v1/search/styles').then(response => {
    const services = response.data
    setStyle(services.data)
  })
  },[]);
  
  useEffect(() => {
    const services = servicesItem.slug  ? servicesItem.slug : urlAddres.pathname.match('(\/s-).*?\/')[0].slice(3,-1)
    const brends = brendsItem.slug ? brendsItem.slug : urlAddres.pathname.match('(\/b-).*?\/')[0].slice(3,-1)
    const style = styleItem.slug ? styleItem.slug : urlAddres.pathname.match('(\/st-).*?\/')[0].slice(4,-1)
    navigate(`/s-${services}/b-${brends}/st-${style}/`)
  },[servicesItem, brendsItem, styleItem, navigate]);

  useEffect(() => {
    const paramS = urlAddres.pathname.match('(\/s-).*?\/')[0].slice(3,-1)
    const paramB = urlAddres.pathname.match('(\/b-).*?\/')[0].slice(3,-1)
    const paramSt = urlAddres.pathname.match('(\/st-).*?\/')[0].slice(4,-1)
    axios
      .get(`https://onboarding.art-code.team/api/test/v1/search/parse_link?brand_slug=${paramB}&service_slug=${paramS}&style_slug=${paramSt}`)
      .then(response => {
        const {brand , service, style} = response.data
        console.log('resp' , response.data)
        setServicesItem(service)
        setBrendItem(brand)
        setStyleItem(style)
      })
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
      <ListItem 
        name='Послуги' 
        value={servicesItem.label} 
        items={services} 
        setItem={ setServicesItem } />
      <ListItem 
        name='Бренди' 
        value={brendsItem.label} 
        items={brends} 
        setItem={  setBrendItem } /> 
      <ListItem 
        name='Стилі' 
        value={styleItem.label} 
        items={style} 
        setItem={  setStyleItem } />
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
      <ListSubheader  onClick={handleOpen} component="div" id="nested-list-subheader">
        { name }
        {open ? <ExpandLess  /> : <ExpandMore onClick={handleOpen}/>}
      </ListSubheader>

    <ListItemButton onClick={handleOpen} >
      <ListItemIcon>
      </ListItemIcon>
      <ListItemText primary={value} />
    </ListItemButton>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List  component="div" disablePadding>
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
