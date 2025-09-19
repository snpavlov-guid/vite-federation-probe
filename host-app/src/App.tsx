import { Route, Routes } from 'react-router-dom';

import { MasterLayout } from './layouts/MasterLayout';
import { HomePage } from './pages/Home';
import { TaskListReactPage } from './pages/TaskListReact';
import { TaskListVuePage } from './pages/TaskListVue';
import { TaskListSolidPage } from './pages/TaskListSolid';

function App() {

  return (
    <MasterLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tasklistreact" element={<TaskListReactPage />} />
        <Route path="/tasklistvue" element={<TaskListVuePage />} />
        <Route path="/tasklistsolid" element={<TaskListSolidPage />} />
      </Routes>
    </MasterLayout>

 
  )
}

export default App
