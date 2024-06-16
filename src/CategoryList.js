import { useState, useEffect, useCallback, useReducer } from "react";
import { Link } from "react-router-dom";
import { format, differenceInCalendarDays, isToday } from 'date-fns';

import { UserContext } from "./App";
import { useContext } from "react";     // також імпортуємо хук контексту
import Admin from "./Admin";

const url = "https://localhost:7022"
const apiPath = url + "/api/category"
const photoPath = url + "/img/content/"

function reducer(state, action) {
    switch (action.type) {
        case 'loadCategories': {
            return {
                ...state,
                categories: action.payload
            };
        }
        case 'deleteCategory': {        // action-payload -- id to delete
            let newState = {...state};
            newState.categories.find(c => c.id == action.payload).deleteDt = new Date().toDateString();
            return newState;
        }
        case 'restoreCategory': {        // action-payload -- id to restore
            let newState = {...state};
            newState.categories.find(c => c.id == action.payload).deleteDt = null;
            return newState;
        }
    }
}

function CategoryList() {
    //let [ctg, setCtg] = useState([]);
    const [state, dispatch] = useReducer(reducer, { categories: [] });
    const { user, token } = useContext(UserContext);

    useEffect(() => {
        console.log(state.categories);
        if (state.categories.length === 0) {
            loadCategories();
        }
    });
    const loadCategories = useCallback(() => {
        fetch(apiPath, {
            headers: (token ? { 'Authorization': `Bearer ${token.id}` } : {})
        })
            .then(r => r.json())
            .then(j => dispatch({ type: 'loadCategories', payload: j }))
    });

    const editCardClick = useCallback((category) => {
        console.log(category);
    })

    return (
        <div className="Home">
            <h1>Categories</h1>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {state.categories.map(c => <CategoryCard category={c} editCardClick={editCardClick} key={c.id} dispatch={dispatch}/>)}
            </div>
            {user != null && user.role == "Admin" && <AdminCategoryForm reloadСategories={loadCategories} />}
        </div>
    );
}

function CategoryCard(props) {
    const { user, token } = useContext(UserContext);
    const delClick = useCallback( () => {
        if (window.confirm("Ви підтверджуєте видалення категорії?")) {
            fetch(`${apiPath}/${props.category.id}`, { 
                method: 'DELETE',
                headers: (token ? { 'Authorization': `Bearer ${token.id}` } : {})
             })
                .then(r => {
                if (r.status < 400) {
                    props.dispatch({type: 'deleteCategory', payload: props.category.id});
                }
                else {
                    alert("Виникла помилка видалення");
                }
            })
        }
    });
    const restoreClick = useCallback( () => {
        if (window.confirm("Ви підтверджуєте вiдновлення категорії?")) {
            fetch(`${apiPath}?id=${props.category.id}`, { 
                method: 'RESTORE',
                headers: (token ? { 'Authorization': `Bearer ${token.id}` } : {})
             })
                .then(r => {
                if (r.status < 400) {
                    props.dispatch({type: 'restoreCategory', payload: props.category.id});
                }
                else {
                    alert("Виникла помилка вiдновлення");
                }
            })
        }
    });

    const editClick = useCallback(() =>{
        props.editCardClick(props.category);
    });

    return <div className="col">
        <div className={"card h-100 " + (props.category.deleteDt ? "card-deleted" : "")}>
            <Link to={props.category.slug}>
                <img src={photoPath + props.category.photoUrl} className="card-img-top" alt="..." />
                <div className="card-body">
                    { !!props.category.deleteDt &&
                        <i>Видалено {formDeleteDate(props.category.deleteDt)}</i>
                    }
                    <h5 className="card-title">{props.category.name}</h5>
                    <p className="card-text">{props.category.description}</p>
                </div>
            </Link>
            {user != null && user.role == "Admin" &&
                <div className="card-footer">
                    {!!props.category.deleteDt &&
                        <button className="btn btn-outline-success"
                            data-type="restore-category"
                            data-category-id="@(Model.Id)"
                            onClick={restoreClick}>
                            Restore
                        </button>
                    }
                    {!props.category.deleteDt &&
                        <button className="btn btn-outline-danger"
                            data-type="delete-category"
                            data-category-id="@(Model.Id)"
                            onClick={delClick}>
                            Del
                        </button>
                    }
                    <button className="btn btn-outline-warning"
                        data-type="edit-category"
                        data-category-name="@(Model.Name)"
                        data-category-description="@(Model.Description)"
                        data-category-slug="@(Model.Slug)"
                        data-category-id="@(Model.Id)"
                        onClick={editClick}>
                        Edit
                    </button>
                </div>
            }
        </div>
    </div>;
}

function formDeleteDate(deleteDt) {
    const date = new Date(deleteDt);
    if (isToday(date)) {
        return format(date, 'HH:mm');
    }
    const daysDifference = differenceInCalendarDays(new Date(), date);
    if (daysDifference < 10) {
        return `${daysDifference} дні тому`;
    }
    return format(date, 'yyyy-MM-dd');
}


function AdminCategoryForm(props) {
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


export default CategoryList;