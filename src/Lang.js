import { useEffect, useState } from 'react';
import { useParams} from 'react-router';


export default function Lang() {
    let [welcome, setWelcome] = useState([]);
    const { slug } = useParams();
    useEffect(() => {
        if(slug === "en"){
            setWelcome("Hello");
        }
        else if(slug === "uk"){
            setWelcome("Вітання");
        }
        else if(slug === "de"){
            setWelcome("Gutten Tag");
        }
        else{
            setWelcome("Language Unrecognized");
        }
    }, [slug]);
    
    return (
        <h1>{welcome}</h1>
);
}