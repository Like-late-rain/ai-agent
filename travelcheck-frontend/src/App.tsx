/**
 * @file Main App Component
 * @description Root application component with routing
 */

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AttractionsPage } from './pages/AttractionsPage'
import { CalendarPage } from './pages/CalendarPage'
import { CheckinPage } from './pages/CheckinPage'
import { HomePage } from './pages/HomePage'
import { RewardsPage } from './pages/RewardsPage'
import { StakePage } from './pages/StakePage'

/**
 * Main App Component
 */
export function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stake" element={<StakePage />} />
          <Route path="/checkin/:stakeId" element={<CheckinPage />} />
          <Route path="/calendar/:stakeId" element={<CalendarPage />} />
          <Route path="/attractions" element={<AttractionsPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
