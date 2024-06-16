import { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from "react-router-dom";
import { UserContext } from './App';


const url = "https://localhost:7022"
const apiPath = url + "/api/location/"
const categoryIdPath = url + "/api/category"
const photoPath = url + "/img/content/"
const formPath = url + "/api/location"

function reducer(state, action){
    switch (action.type) {
        case 'setCatId': return { ...state, catId: action.payload.id };
        case 'setLocations': return { ...state, locations: action.payload };
    }
    throw `reducer: action type ${action.type} unrecognized`;
}

function Category() {
    const { slug } = useParams();
    const { user } = useContext(UserContext);
    const [state, dispatch] = useReducer(reducer, { locations: [], catId: "" });

    //let [locations, setLocations] = useState([]);

    useEffect(() => {
        loadLocatoins();
        fetch(`${categoryIdPath}?slug=${slug}`, {method: "PATCH"})
            .then(r => r.json()).then(j => dispatch({type: "setCatId", payload: j}))
    }, [slug]);

    const loadLocatoins = useCallback(() => {
        const _url = apiPath + slug;
        fetch(_url).then(r => r.json()).then(j => dispatch({ type: 'setLocations', payload: j }));
    })

    return (
        <div className="Category">
            <h1>Category {slug}</h1>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {state.locations.map(loc => <LocationCard location={loc} key={loc.id} />)}
            </div>
            {user != null && user.role == "Admin" && <AdminCategory categoryId={state.catId} loadLocations={loadLocatoins} />}
        </div>
    );
}

function LocationCard(props) {
    return <div className="col">
        <div className="card h-100">
            <Link to={"/location/" + props.location.slug}>
                <img src={photoPath + (props.location.photoUrl ?? "no-image.jpg")}
                    className="card-img-top" alt="image" />
                <div className="card-body">
                    <h5 className="card-title">{props.location.name}</h5>
                    <p className="card-text">{props.location.description}</p>
                </div>
            </Link>
        </div>
    </div>
}

function AdminCategory(props) {
    const [formData, setFormData] = useState({
        'loc-name': '',
        'loc-description': '',
        'loc-slug': '',
        'loc-stars': '',
        'loc-photo': null,
        'category-id': props.categoryId
    });
    const formSubmit = useCallback(e => {
        e.preventDefault();
        const form = e.target;
        let formData = new FormData(form);
        fetch(formPath, {
            method: 'POST',
            body: formData
        }).then(r => {
            console.log(r);
            if (r.status == 201) {
                setFormData({
                    'loc-name': '',
                    'loc-description': '',
                    'loc-slug': '',
                    'loc-stars': '',
                    'loc-photo': null,
                    'category-id': props.categoryId
                });
                props.loadLocations();
                alert("Комната успешно добавлена в БД");
            }
            else {
                r.text().then(alert);
            }
        });
    }, [props.categoryId, props.loadLocations]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);

    return <>
        <hr />
        <h3>Добавление локации</h3>
        <form id="loc-form" method="post" encType="multipart/form-data" onSubmit={formSubmit}>
            <div className="row">
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="loc-name"><i className="bi bi-person-vcard"></i></span>
                        <input type="text" className="form-control"
                            placeholder="Назва" name="loc-name"
                            aria-label="Loc Name" aria-describedby="loc-name" value={formData['loc-name']} onChange={handleChange} />
                        <div className="invalid-feedback">Ім'я не може бути порожнім</div>
                    </div>
                </div>
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="loc-description"><i className="bi bi-envelope-at"></i></span>
                        <input type="text" className="form-control"
                            name="loc-description" placeholder="Опис"
                            aria-label="Description" aria-describedby="loc-description" value={formData['loc-description']} onChange={handleChange} />
                        <div className="invalid-feedback">Опис не може бути порожнім</div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="loc-slug"><i className="bi bi-lock"></i></span>
                        <input type="text" className="form-control" placeholder="Slug"
                            name="loc-slug"
                            aria-label="Loc Slug" aria-describedby="loc-slug" value={formData['loc-slug']} onChange={handleChange} />
                        <div className="invalid-feedback">Slug должен быть уникальным</div>
                    </div>
                </div>
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="loc-stars"><i className="bi bi-unlock"></i></span>
                        <input type="number" className="form-control"
                            name="loc-stars"
                            aria-label="Loc Stars" aria-describedby="loc-stars" value={formData['loc-stars']} onChange={handleChange} />
                        <div className="invalid-feedback">Рейтинг не может быть пустым</div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="input-group mb-3">
                        <label className="input-group-text" htmlFor="loc-photo"><i className="bi bi-person-circle"></i></label>
                        <input type="file" className="form-control" name="loc-photo" id="loc-photo" value={formData['loc-photo']} onChange={handleChange} />
                        <div className="invalid-feedback">Файл должен быть типа изображения</div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button type="submit" className="btn btn-secondary"
                        name="room-button" value="true">
                        Додати
                    </button>
                </div>
            </div>
            <input type="hidden" name="category-id" value={props.categoryId} />
        </form>
    </>;
}

export default Category;