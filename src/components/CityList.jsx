import styles from './CityList.module.css';
import Spinner from "./Spinner.jsx";
import CityItem from "./CityItem.jsx";
import Message from "./Message.jsx";

function CityList({cities, isLoading}) {
    if (!cities.length)
        return <Message message={"add your first city by clicking on a city on the map"}/>
    return (
        <>
            {isLoading && <Spinner/>}
            <ul className={styles.cityList}>
                {cities.map(city => (
                    <CityItem key={city.id} city={city}/>
                ))}
            </ul>
        </>
    );
}

export default CityList;