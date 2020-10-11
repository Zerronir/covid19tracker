import React, {useState, useEffect} from 'react';
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

      <div className="app__header">
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

        

      {/*HEADER*/}
      {/*Title + select country*/}
      
      {/*Info box*/}
      {/*Info box*/}
      {/*Info box*/}

      {/*Table*/}
      {/*Graph*/}

      {/*Map*/}
    </div>
    );
}

export default App;