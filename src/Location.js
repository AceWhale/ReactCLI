import { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from "react-router-dom";
import { UserContext } from './App';


const url = "https://localhost:7022";
const apiPath = url + "/api/Room/all/";
const locIdPath = url + "/api/location";
const photoPath = url + "/img/content/";
const formPath = url + "/api/room";

function reducer(state, action) {
    switch (action.type) {
        case 'setLocId': return { ...state, locId: action.payload.id };
        case 'setRooms': return { ...state, rooms: action.payload };
    }
    throw `reducer: action type ${action.type} unrecognized`;
}

export default function Location() {
    const { slug } = useParams();
    const { user } = useContext(UserContext);
    const [state, dispatch] = useReducer(reducer, { rooms: [], locId: "" });

    //let [rooms, setRooms] = useState([]);
    //let [locId, setLocId] = useState("");

    useEffect(() => {
        loadRooms();
        fetch(`${locIdPath}?slug=${slug}`, { method: 'PATCH' })
            .then(r => r.json()).then(j => dispatch({ type: 'setLocId', payload: j }));       // ~GetLocationBySlug()
    }, [slug]);

    const loadRooms = useCallback(() => {
        const _url = apiPath + slug;
        fetch(_url).then(r => r.json()).then(j => dispatch({ type: 'setRooms', payload: j }));
    })

    return <>
        <h1>Location: {slug}</h1>
        <div className="row row-cols-2 row-cols-md-4 g-4">
            {state.rooms.map(r => <RoomCard room={r} key={r.id} />)}
        </div>
        {user != null && user.role == "Admin" && <AdminLocation locationId={state.locId} loadRooms={loadRooms} />}
    </>
}

function RoomCard(props) {
    return <div className="col">
        <div className="card h-100">
            <Link to={"/room/" + (props.room.slug ?? props.room.id)}>
                <img src={photoPath + (props.room.photoUrl ?? "no-image.jpg")}
                    className="card-img-top" alt="image" />
                <div className="card-body">
                    <h5 className="card-title">{props.room.name}</h5>
                    <p className="card-text">{props.room.description}</p>
                </div>
            </Link>
        </div>
    </div>;
}


function AdminLocation(props) {
    const [formData, setFormData] = useState({
        'room-name': '',
        'room-description': '',
        'room-slug': '',
        'room-stars': '',
        'room-photo': null,
        'room-price': '',
        'location-id': props.locationId
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
                    'room-name': '',
                    'room-description': '',
                    'room-slug': '',
                    'room-stars': '',
                    'room-photo': null,
                    'room-price': '',
                    'location-id': props.locationId
                });
                props.loadRooms();
                alert("Комната успешно добавлена в БД");
            }
            else {
                r.text().then(alert);
            }
        });
    }, [props.locationId, props.loadRooms]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);

    return <>
        <hr />
        <h3>Добавление комнаты</h3>
        <form id="room-form" method="post" enctype="multipart/form-data" onSubmit={formSubmit}>
            <div className="row">
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="room-name"><i className="bi bi-person-vcard"></i></span>
                        <input type="text" className="form-control"
                            placeholder="Назва" name="room-name"
                            aria-label="Room Name" aria-describedby="room-name" value={formData['room-name']} onChange={handleChange} />
                        <div className="invalid-feedback">Ім'я не може бути порожнім</div>
                    </div>
                </div>
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="room-description"><i className="bi bi-envelope-at"></i></span>
                        <input type="text" className="form-control"
                            name="room-description" placeholder="Опис"
                            aria-label="Description" aria-describedby="room-description" value={formData['room-description']} onChange={handleChange} />
                        <div className="invalid-feedback">Опис не може бути порожнім</div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="room-slug"><i className="bi bi-lock"></i></span>
                        <input type="text" className="form-control" placeholder="Slug"
                            name="room-slug"
                            aria-label="Room Slug" aria-describedby="room-slug" value={formData['room-slug']} onChange={handleChange} />
                        <div className="invalid-feedback">Slug должен быть уникальным</div>
                    </div>
                </div>
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="room-stars"><i className="bi bi-unlock"></i></span>
                        <input type="number" className="form-control"
                            name="room-stars"
                            aria-label="Room Stars" aria-describedby="room-stars" value={formData['room-stars']} onChange={handleChange} />
                        <div className="invalid-feedback">Рейтинг не может быть пустым</div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="input-group mb-3">
                        <label className="input-group-text" for="room-photo"><i className="bi bi-person-circle"></i></label>
                        <input type="file" className="form-control" name="room-photo" id="room-photo" value={formData['room-photo']} onChange={handleChange} />
                        <div className="invalid-feedback">Файл должен быть типа изображения</div>
                    </div>
                </div>
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="room-price"><i className="bi bi-coin"></i></span>
                        <input type="number" min="100" step="0.01" className="form-control" name="room-price"
                            aria-label="Room Price" aria-describedby="room-price" value={formData['room-price']} onChange={handleChange} />
                        <div className="invalid-feedback">Цена не может быть пустым</div>
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
            <input type="hidden" name="location-id" value={props.locationId} />
        </form>
    </>;
}