import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// стили
import './styles/index.css'

// компоненты 
import Search from './pages/Search/Search';
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';
import HymnList from './pages/HymnList/HymnList';
import ExtraHymn from './pages/Hymn/Hymn';
import Arrows from './components/Arrows/Arrows';

// redux
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { hymnsSlice } from './redux/reducers/HymnSlice'
import { toFetchHymns } from './redux/reducers/ActionCreator';

// utils
import { ROUTES } from './utils/routes';

// localStorage
import { getFavoriteHymnsLS } from './tools/storage';



function App() {
  const { hymns, isLoading, error, favoriteHymns, foundedHymns, currentHymn, historyHymns } = useAppSelector(state => state.hymnReducer)
  const dispatch = useAppDispatch()

  useEffect(() => {
    toFetchHymns(dispatch)
    dispatch(hymnsSlice.actions.setFavoriteHymnsList(getFavoriteHymnsLS()))
    dispatch(hymnsSlice.actions.getHistoryHymns())
  }, [hymns.length])

  return (
    <BrowserRouter>
      <>
        <Menu />
        <Header />
        <div className='App'>
          <Routes>
            <Route path={ROUTES.home} element={<Search />} />
            <Route path={ROUTES.home + ROUTES.foundedHymns} element={<HymnList title='Найденные гимны' isLoading={isLoading} list={foundedHymns} />} />
            <Route path={ROUTES.home + ROUTES.favoriteHymns} element={<HymnList title='Избранные гимны' isLoading={isLoading} list={favoriteHymns} />} />
            <Route path={ROUTES.home + ROUTES.sortedHymns} element={<HymnList title='Содержание' isLoading={isLoading} list={hymns} />} />
            <Route path={ROUTES.home + ROUTES.history} element={<HymnList title='История' isLoading={isLoading} list={historyHymns} />} />
            <Route path={ROUTES.home + ROUTES.hymns + ROUTES.hymn} element={<ExtraHymn />} />
          </Routes>
          {currentHymn && <Arrows />}
        </div>
      </>
    </BrowserRouter>
  );

}

export default App;