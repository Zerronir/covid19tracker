import React, {useState, useEffect} from 'react';
import InfoBox from './InfoBox';
import {MenuItem, FormControl, Select} from '@material-ui/core';
import './App.css';

function App() {

    const [countires, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide') 
    useEffect(() => {
      const getCountriesData = async () => {
        await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          setCountries(countries); 
        })
      }

      getCountriesData();
    }, []);


    //OnCountryChange
    const onCountryChange = async (event) => {
      const countryCode = event.target.value;
      setCountry(countryCode);
    }

    return ( 
    <div className="app">
      {/*HEADER*/}
      <div className="app__header">
        {/*Title + select country*/}
        <h1> Seguimiento Covid-19 </h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value={country} onChange={onCountryChange}>
            {/*Bucle por los paises*/}
            <MenuItem value="worldwide">WorldWide</MenuItem>
            {countires.map(country => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      
      <div className="app__stats">
          <InfoBox title="Casos de covid" cases={1234} total="2000"></InfoBox>
          <InfoBox title="Recuperados" cases={1234} total="3000"></InfoBox>
          <InfoBox title="Muertos" cases={1234} total="4000"></InfoBox>
      </div>
      

      {/*Table*/}
      {/*Graph*/}

      {/*Map*/}
    </div>
    );
}

export default App;