import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const url = "https://localhost:7290"
const apiPath = url + "/api/category/"
const photoPath = url + "/images/content/"

function FutureHome(){
    let [ctg, setCtg] = useState([]);
    useEffect(() => {
        if (ctg.length === 0) {
            loadCategories();
        }
    });
    const loadCategories = useCallback(() => {
        fetch(apiPath)
            .then(r => r.json())
            .then(j => setCtg(j))
    });
    return (
        <div className="Home">
            <h1>Categories</h1>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {ctg.map(c => <CategoryCard category={c} key={c.id} />)}
            </div>
        </div>
    );
}

function CategoryCard(props) {
    return <div className="col">
        <div className="card h-100">
            <Link to={props.category.slug}>
                <img src={photoPath + props.category.photoUrl} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{props.category.name}</h5>
                    <p className="card-text">{props.category.description}</p>
                </div>
            </Link>
        </div>
    </div>;
}


export default FutureHome;