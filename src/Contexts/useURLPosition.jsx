import {useSearchParams} from "react-router-dom";

export function useURLPosition(){
    const [seachParams, setSearchParams] =useSearchParams();
    const lat = seachParams.get("lat");
    const lng = seachParams.get("lng");
    return {lat, lng};
}