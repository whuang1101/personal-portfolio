import React from 'react'
import ReactDOM from 'react-dom/client'
import FirstPage from './components/FirstPage.jsx'
import Header from './components/Header.jsx'
import AboutPage from './components/About.jsx'
import SkillsPage from './components/Skills.jsx'
import ProjectsPage from './components/Projects.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Header />
      <FirstPage />
      <AboutPage/>
      <SkillsPage/>
      <ProjectsPage/>
  </React.StrictMode>,
)
