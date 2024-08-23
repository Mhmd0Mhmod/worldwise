
import {useEffect, useState} from "react";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Form.module.css";
import {useNavigate} from "react-router-dom";
import Button from "./Button.jsx";
import BackButton from "./BackButton.jsx";
import {useURLPosition} from "../Contexts/useURLPosition.jsx";
import Message from "./Message.jsx";
import Spinner from "./Spinner.jsx";
import DatePicker from "react-datepicker";
import {useCities} from "../Contexts/CitiesContext.jsx";

export function convertToEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
    const navigate = useNavigate();
    const{createCity,loading} = useCities();
    const [cityName, setCityName] = useState("");
    const [country, setCountry] = useState("");
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState("");
    const {lat, lng} = useURLPosition();
    const [isLoadingGeoLocation, setIsLoadingGeoLocation] = useState(false);
    const [emoji, setEmoji] = useState("");
    const [geoCodingError, setGeoCodingError] = useState("");
    useEffect(() => {
            async function fetchCountry() {
                if(!lat && !lng) return;
                try {
                    setIsLoadingGeoLocation(true);
                    const response = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
                    const data = await response.json();
                    if(!data.city)throw new Error("That's not seem to be a city , Click somewhere else");
                    setCountry(data.countryName);
                    setCityName(data.city || data.locality)
                    setEmoji(convertToEmoji(data.countryCode));
                    setGeoCodingError("");
                } catch (error) {
                    setGeoCodingError(error.message);
                } finally {
                    setIsLoadingGeoLocation(false);
                }
            }

            fetchCountry();
        }
        ,
        [lat, lng]
    );
    function handleSumbitForm(event) {
        event.preventDefault();
        if(!cityName || !date) return;
        const newTrip = {
            cityName,
            country,
            emoji,
            date,
            notes,
            position: {lat, lng},
        };
        createCity(newTrip).then(() => navigate("/app"));
    }
    if(isLoadingGeoLocation) return <Spinner />
    if(!lat || !lng) return <Message message="Click on the map to select a location" />
    if(geoCodingError) return <Message message={geoCodingError} />
    return (
        <form className={`${styles.form} ${loading?  styles.loading :""}`} onSubmit={handleSumbitForm}>
            <div className={styles.row}>
                <label htmlFor="cityName">City name</label>
                <input id="cityName" onChange={(e) => setCityName(e.target.value)} value={cityName}/>
                 <span className={styles.flag}>{emoji}</span>
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                <DatePicker onChange={date=>setDate(date)} selected={date} dateFormat={"dd/mm/yyyy"}/>
                {/*<input id="date" onChange={(e) => setDate(e.target.value)} value={date}/>*/}
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">Notes about your trip to {cityName}</label>
                <textarea id="notes" onChange={(e) => setNotes(e.target.value)} value={notes}/>
            </div>

            <div className={styles.buttons}>
                <Button type={"primary"}>Add</Button>
                <BackButton> &larr; Back</BackButton>
            </div>
        </form>
    );
}

export default Form;
