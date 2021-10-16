import {useState, useEffect} from 'react';
import axios from 'axios';

export function useColumnsList(initValue) {
    let [value, setValue] = useState(initValue);
    
    useEffect(() => {
        axios.get("https://plotter-task.herokuapp.com/columns").then((res) => {
            console.log(res.data);
            setValue(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }, []);    

    return value
}
