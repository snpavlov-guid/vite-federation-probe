import { Route, Routes } from 'react-router-dom';

import { MasterLayout } from './layouts/MasterLayout';
import { HomePage } from './pages/Home';
import { TaskListReactPage } from './pages/TaskListReact';
import { TaskListVuePage } from './pages/TaskListVue';
import { LeagueAppPage } from './pages/LeagueApp';

function App() {

  return (
    <MasterLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tasklistreact" element={<TaskListReactPage />} />
        <Route path="/tasklistvue" element={<TaskListVuePage />} />
        {/* <Route path="/tasklistsolid" element={<TaskListSolidPage />} /> */}
        <Route path="/leagueapp" element={<LeagueAppPage />} />
      </Routes>
    </MasterLayout>

 
  )
}

export default App
