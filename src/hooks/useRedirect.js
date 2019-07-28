import { useEffect } from 'react';
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

export default (newLocation) => {
    history.push(newLocation)
}