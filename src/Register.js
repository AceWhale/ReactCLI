import { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from "react-router-dom";
import { UserContext } from './App';

const url = "https://localhost:7022";
const formPath = url + "/api/auth";

function Register(props) {
    const [formData, setFormData] = useState({
        'user-name': '',
        'user-email': '',
        'user-password': '',
        'user-repeat': '',
        'user-avatar': null,
        'user-birthdate': '',
        'user-agreement': false
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
                    'user-name': '',
                    'user-email': '',
                    'user-password': '',
                    'user-repeat': '',
                    'user-avatar': null,
                    'user-birthdate': '',
                    'user-agreement': false
                });
                alert("Пользователь успешно добавлен")
            }
            else {
                r.text().then(alert);
            }
        });
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);
    return <>
        <h3>Sign Up</h3>
        <form id="user-form" method="post" enctype="multipart/form-data" onSubmit={formSubmit}>
            <div className="row">
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="user-name"><i className="bi bi-person-vcard"></i></span>
                        <input type="text"
                            className="form-control"
                            placeholder="Username"
                            name="user-name"
                            value={formData['user-name']}
                            aria-label="Username" aria-describedby="user-name" onChange={handleChange} />
                        <div className="invalid-feedback">Поле с именем не дожен быть пустым</div>
                    </div>
                </div>
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="user-email"><i className="bi bi-envelope-at"></i></span>
                        <input type="text" className="form-control" placeholder="Email"
                            name="user-email"
                            value={formData['user-email']}
                            aria-label="Email" aria-describedby="user-email" onChange={handleChange} />
                        <div className="invalid-feedback">Поле с почтой не дожен быть пустым</div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="user-password"><i className="bi bi-lock"></i></span>
                        <input type="password" className="form-control" placeholder="Пароль"
                            name="user-password"
                            value={formData['user-password']}
                            aria-label="UserPassword" aria-describedby="user-password" onChange={handleChange} />
                        <div className="invalid-feedback">Введен неверный пароль</div>
                    </div>
                </div>
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="user-repeat"><i className="bi bi-unlock"></i></span>
                        <input type="password" className="form-control" placeholder="Повторiть пароль"
                            name="user-repeat"
                            aria-label="Repeat" aria-describedby="user-repeat" onChange={handleChange} />
                        <div className="invalid-feedback">Пароли не совпадают</div>
                    </div>
                </div>

            </div>

            <div className="row">
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="user-birthdate"><i className="bi bi-cake2"></i></span>
                        <input type="date" className="form-control"
                            name="user-birthdate"
                            value={formData['user-birthdate']}
                            aria-label="UserBirthdate" aria-describedby="user-birthdate" onChange={handleChange} />
                        <div className="invalid-feedback">Поле не должен быть пустым</div>
                    </div>
                </div>
                <div className="col">
                    <div className="input-group mb-3">
                        <label className="input-group-text" for="user-avatar"><i className="bi bi-person-circle"></i></label>
                        <input type="file" className="form-control" name="user-avatar" id="user-avatar"
                            aria-label="UserAvatar" aria-describedby="user-avatar" />
                        <div className="invalid-feedback">Файл должен быть типа изображения</div>
                    </div>
                </div>

            </div>

            <div className="row">
                <div className="col">
                    <div className="form-check">
                        <input className="form-check-input" name="user-agreement" type="checkbox" value="true" id="user-agreement" onChange={handleChange} />
                        <label className="form-check-label" for="agreement">Погоджуюсь із правилами сайту</label>
                        <div className="invalid-feedback">Нужно потвердить соглашение с правилами сайта</div>
                    </div>
                </div>
                <div className="col">
                    <button type="submit" name="signup-button" value="true" className="btn btn-secondary">Реєстрація</button>
                </div>
            </div>
        </form>
    </>
}

export default Register;