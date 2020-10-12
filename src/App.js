import React, {useState, useEffect} from 'react';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {MenuItem, FormControl, Select, Card, CardContent} from '@material-ui/core';
import './App.css';

function App() {

    const [countires, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide')
    const [tableData, setTableData] = useState([]);

    // TEST API PERSONAL
    const [animals, setAnimalData] = useState([]);

    useEffect(() => {
      const getAnimalsData = async () => {
        await fetch("http://localhost:8081/api/v1/animals")
              .then((response) => response.json())
              .then((data) => {
                const animals = data.map((animal) => (
                  {
                    name: animal.pet,
                    owner: animal.ownerName
                  }
                ));

                setAnimalData(animals);
              })
      }
      getAnimalsData();
    }, []);

    // Recuento de casos en el mundo
    useEffect(() => {
      fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then(data => {
        setCountryInfo(data);
      })
    }, []);

    // Lo usamos para listar los paises
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

          setTableData(data);
          setCountries(countries); 
        })
      }

      getCountriesData();
    }, []);

    const [countryInfo, setCountryInfo] = useState({});


    //OnCountryChange --> Listamos los casos por país según lo cambiamos. Por defecto listará los casos mundiales
    const onCountryChange = async (event) => {
      const countryCode = event.target.value;
      
      // CountryCode => 
      const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
      
      await fetch(url)
            .then((response) => response.json())
            .then((data) => {
              setCountry(countryCode);
              setCountryInfo(data);
            });
      console.log("Info del pais >>>> " + countryInfo);
    }

    // Pintamos los resultados en el html
    return ( 
    <div className="app">
      <div className="app__left">
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
        <div className="app__stats">
            <InfoBox title="Casos de covid" cases={countryInfo.todayCases} total={countryInfo.cases}></InfoBox>
            <InfoBox title="Recuperados" cases={countryInfo.todayRecovered} total={countryInfo.recovered}></InfoBox>
            <InfoBox title="Muertos" cases={countryInfo.todayDeaths} total={countryInfo.deaths}></InfoBox>
        </div>
        <Map></Map>

        <div>
          {animals.map(animal => (
            <p>Nombre: {animal.name} -- Dueño: {animal.owner}</p>
          ))}
        </div>

      </div>
      
      <Card className="app__right">
        <CardContent>
          <h3>Casos por país</h3>
          <Table countries={tableData}>

          </Table>
          <h3>Casos mundiales</h3>
        </CardContent>
      </Card>
    </div>
    );
}

export default App;