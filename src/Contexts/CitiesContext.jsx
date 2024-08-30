import { act, createContext, useCallback, useContext, useEffect, useReducer, useState } from "react";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();
const initalState = {
  cities: [],
  loading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true };
    case "cities/loaded":
      return { ...state, loading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, loading: false, currentCity: action.payload };
    case "city/created":
      return { ...state, loading: false, cities: [...state.cities, action.payload], currentCity: action.payload };
    case "city/deleted":
      return { ...state, loading: false, cities: state.cities.filter((city) => city.id !== action.payload), currentCity: {} };

    case "rejected":
      return { ...state, loading: false, error: action.payload };
    default:
      throw new Error("No Action Type");
  }
}
function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [currentCity, setCuttentCity] = useState({});
  const [{ cities, loading, currentCity }, dispatch] = useReducer(reducer, initalState);
  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({ type: "rejected", payload: "there were an error in data loading ... " });
      }
    }

    fetchCities();
  }, []);
  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const response = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await response.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch (error) {
        dispatch({ type: "rejected", payload: "there were error in getCity " });
      }
    },
    [currentCity.id]
  );
  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const response = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      dispatch({ type: "rejected", payload: "there were error in  createCity" });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      const response = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      dispatch({ type: "rejected", payload: "there were error in deleteCity" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        loading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) throw new Error("CitiesContext are used outside CitiesProvider");
  return context;
}
export { CitiesProvider, useCities };
