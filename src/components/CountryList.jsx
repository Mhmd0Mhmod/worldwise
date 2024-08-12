import styles from './CountryList.module.css';
import Spinner from "./Spinner.jsx";
import CountryItem from "./CountryItem.jsx";
import Message from "./Message.jsx";

function CountryList({cities, isLoading}) {
    if (!cities.length)
        return <Message message={"add your first city by clicking on a city on the map"}/>
    const countries = cities.reduce((acc, city) => {
            if (!acc.find(country => country.id === city.id))
                acc.push({country: city.country, id: city.id, emoji: city.emoji});
            return acc;
        }
        , []);
    return (
        <>
            {isLoading && <Spinner/>}
            <ul className={styles.countryList}>
                {countries?.map(country => (
                    <CountryItem key={country.id} country={country}/>
                ))}
            </ul>
        </>
    );
}

export default CountryList;