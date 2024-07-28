import { Route, Routes } from 'react-router-dom';
import HomePage  from './pages/HomePage/HomePage';
import AuthPage from './pages/AuthPage/AuthPage';
import PageLayouts from './Layouts/PageLayouts/PageLayouts';
import ProfilePage from './pages/ProfilePage/ProfilePage';

function App() {
  return (
    <>
    <PageLayouts>
      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/auth' element={<AuthPage />}/>
        <Route path='/:username' element={<ProfilePage />}/>
      </Routes>
    </PageLayouts>
    </>
  )
}

export default App;
