import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Homepage from "./pages/Homepage.jsx";
import Product from "./pages/Product.jsx";
import Pricing from "./pages/Pricing.jsx";
import Login from "./pages/Login.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import "./index.css";
import AppLayout from "./pages/AppLayout.jsx";
import CityList from "./components/CityList.jsx";
import {useEffect, useState} from "react";
import CountryList from "./components/CountryList.jsx";
import City from "./components/City.jsx";
import Form from "./components/Form.jsx";

const BASE_URL = "http://localhost:9000";

function App() {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchCities() {
            const response = await fetch(`${BASE_URL}/cities`);
            const data = await response.json();
            setCities(data);
            setLoading(false);
        }

        fetchCities();
        return () => {
            console.log("cleanup");
        }
    }, []);
    return <>
        <BrowserRouter>
            <Routes>
                <Route index element={<Homepage/>}/>
                <Route path="product" element={<Product/>}/>
                <Route path="pricing" element={<Pricing/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="app" element={<AppLayout/>}>
                    <Route index element={<Navigate replace to={"cities"}/> }/>
                    <Route path={"cities"} element={<CityList cities={cities} isLoading={loading}/>}/>
                    <Route path={"cities/:id"} element={<City/>}/>
                    <Route path={"countries"} element={<CountryList cities={cities} isLoading={loading}/>}/>
                    <Route path={"form"} element={<Form/>}/>
                    <Route path="*" element={<PageNotFound/>}/>
                </Route>
                <Route path="*" element={<PageNotFound/>}/>

            </Routes>
        </BrowserRouter>
    </>;
}

export default App;
