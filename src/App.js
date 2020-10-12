import React, {useState, useEffect} from 'react';
import {sortData} from './util';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import numeral from 'numeral';
import prettyPrintStat from 'chart.js';
import {MenuItem, FormControl, Select, Card, CardContent} from '@material-ui/core';
import './App.css';
import 'leaflet/dist/leaflet.css';

function App() {

    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide')
    const [tableData, setTableData] = useState([]);
    const [casesType, setCasesType] = useState("cases");
    const [countryInfo, setCountryInfo] = useState({});
    const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796 });
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);

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
          

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries); 
        })
      }

      getCountriesData();
    }, []);

    


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
              setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
              setMapZoom(4);
            });
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
              {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
        <InfoBox
            title="Activos"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recuperados"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Muertos"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
        />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}/>

      </div>
      
      <Card className="app__right">
        <CardContent>
          <h3>Casos por país</h3>
          <Table countries={tableData} />
          
          <h3>Casos mundiales</h3>
          <LineGraph casesType={casesType} />

        </CardContent>
      </Card>
    </div>
    );
}

export default App;