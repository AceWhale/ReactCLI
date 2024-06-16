import Home from './Home';
import Category from './Category';
import Admin from './Admin';
import Layout from './Layout';
import Location from './Location';
import Room from './Room';
import Privacy from './Privacy';
import Lang from './Lang';
import FutureHome from './FutureHome';
import Register from './Register';
import FutureCategory from './FutureCategory';
import CategoryList from './CategoryList';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useEffect, useState } from 'react';
import './App.css';

/* Контекст - певний аналог глобальних змінних, доступних у різних частинах
проєкту, який також містить механізми спостереження за змінами контексту
та повідомлення про них своїх підписників */
export const UserContext = createContext(null);

function App() {
  /* Значення, що їх буде моніторити контекст - знаходяться максимально "високо"
     за ієрархією елементів - у найпершому елементі Арр */
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // console.log('App Effect');
    const t = window.localStorage.getItem('token');
    if (t) {
      setToken(JSON.parse(t));
    }
    const u = window.localStorage.getItem('user');
    if (u) {
      setUser(JSON.parse(u));
    }
  }, []);

  /* Те, що знаходиться у провайдері контексту (<UserContext.Provider ... )
     є підписниками на його зміни. Відповідно, будь-який елемент в середині
     тіла контексту може викликати set-тер і всі інші елементи одержать це
     повідомлення. */
  return (
    <UserContext.Provider value={{ user: user, setUser: setUser, token: token, setToken: setToken }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="admin" element={<Admin />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="category/" element={<CategoryList />} />
            <Route path="category/:slug" element={<Category />} />
            <Route path="location/:slug" element={<Location />} />
            <Route path="room/:slug" element={<Room />} />
            <Route path="lang/:slug" element={<Lang />} />
            <Route path="Content/Category/" element={<FutureHome />} />
            <Route path="Content/Category/:slug" element={<FutureCategory />} />
            <Route path="Signup" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
