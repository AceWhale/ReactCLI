import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

/* (Контекст) У дочірніх елементах контексту зазначаємо імпорт самого контексту,
    оголошеного як export у файлі Арр */
import { UserContext } from "./App";
import { useContext } from "react";     // також імпортуємо хук контексту
import Admin from "./Admin";

const url = "https://localhost:7022";
const apiPath = url + "/api/category/";
const photoPath = url + "/img/content/";


function Home() {
    let [ctg, setCtg] = useState([]);

    /* (Контекст) одержуємо посилання, що їх провадить контекст (через .Provider value=...) */
    const { user, setUser } = useContext(UserContext);

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
            <h1>Home</h1>
            <div className="row row-cols-1 row-cols-md-3 g-4">
            </div>
            {user != null && user.role == "Admin" && <AdminCategoryForm reloadСategories = {loadCategories}/>}
        </div>
    );
}

function AdminCategoryForm( props ) {
    /* useCallback - хук, що дозволяє не створювати функцію повторно
        з кожним перезапуском  AdminCategoryForm() */
    const formSubmit = useCallback(e => {
        e.preventDefault();
        const form = e.target;
        let formData = new FormData(form);
        // console.log(formData);
        fetch(apiPath, {
            method: 'POST',
            body: formData
        }).then(r => {
            console.log(r);
            if (r.status == 201) {
                props.reloadСategories();
            }
            else {
                r.text().then(alert);
            }
        });
    });
    return <>
        <hr />
        <form id="category-form" method="post" enctype="multipart/form-data" onSubmit={formSubmit}>
            <div className="row">
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="category-name"><i className="bi bi-person-vcard"></i></span>
                        <input type="text" className="form-control"
                            placeholder="Назва" name="category-name"
                            aria-label="Category Name" aria-describedby="category-name" />
                        <div className="invalid-feedback">Ім'я не може бути порожнім</div>
                    </div>
                </div>
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="category-description"><i className="bi bi-file-text"></i></span>
                        <input type="text" className="form-control"
                            name="category-description" placeholder="Опис"
                            aria-label="Description" aria-describedby="category-description" />
                        <div className="invalid-feedback">Опис не може бути порожнім</div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="category-slug"><i className="bi bi-link"></i></span>
                        <input type="text" className="form-control" placeholder="Slug"
                            name="category-slug"
                            aria-label="Category Slug" aria-describedby="category-slug" />
                        <div className="invalid-feedback">Slug должен быть уникальным</div>
                    </div>
                </div>
                <div className="col">
                    <div className="input-group mb-3">
                        <label className="input-group-text" for="category-photo"><i className="bi bi-image"></i></label>
                        <input type="file" className="form-control" name="category-photo" id="category-photo" />
                        <div className="invalid-feedback">Файл должен быть типа изображения</div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button type="submit" className="btn btn-secondary"
                        name="category-button" value="true">
                        Зберегти
                    </button>
                </div>
            </div>
            <input type="hidden" name="category-id" value="" />
        </form>
        <hr />
    </>;
}

function CategoryCard(props) {
    return <div className="col">
        <div className="card h-100">
            <Link to={"category/" + props.category.slug}>
                <img src={photoPath + props.category.photoUrl} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{props.category.name}</h5>
                    <p className="card-text">{props.category.description}</p>
                </div>
            </Link>
        </div>
    </div>;
}



export default Home;