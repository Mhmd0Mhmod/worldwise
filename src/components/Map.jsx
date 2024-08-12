import styles from './Map.module.css';
import {useNavigate, useSearchParams} from "react-router-dom";
function Map() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const lat = searchParams.get("lat");
    const lng =searchParams.get("lng");
    console.log(lat,lng);
 return (
  <div className={styles.mapContainer} onClick={()=>navigate("form")}>
    Map
      <button onClick={()=>setSearchParams({lat:50,lng:90})}>Click</button>
  </div>
 );}

export default Map;