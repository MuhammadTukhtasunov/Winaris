import MainLayout from './components/MainLayout/MainLayout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';                                                   // Winaris (home page)
import StudentEvaluations from './pages/StudentEvaluations/StudentEvaluations';
import Shop from './pages/Shop/Shop';                                                   // Winaris (shop page)
import StudentEvaluationsDetails from './pages/StudentEvaluationsDetails/StudentEvaluationsDetails';
import CourseAnalytics from './pages/CourseAnalytics/CourseAnalytics';
import TeamAssessments from './pages/TeamAssessments/TeamAssessments';
import ResearchInfo from './pages/ResearchInfo/ResearchInfo';
import GrantUpload from './pages/GrantUpload/GrantUpload';
import ExpenUpload from './pages/ExpenUpload/ExpenUpload';
import EvalUpload from './pages/EvalUpload/EvalUpload';
import PartsUpload from './pages/PartsUpload/PartsUpload';
import AccountSettings from './pages/AccountSettings/AccountSettings';
import UserAdmin from './pages/UserAdmin/UserAdmin';
import SetPassword from './pages/SetPassword/SetPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import SplashPage from './pages/SplashPage/SplashPage';
import { useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import './pages/main_pages.css'
import PubUpload from './pages/PubUpload/PubUpload';

function App() {

  const { user, checkedStorage } = useAuthContext()

  const defaultPage = <SplashPage />

  const getMainLayoutPage = (page) => {
    return (
      <MainLayout>
        { page }
      </MainLayout>
    )
  }

  return (
    checkedStorage ? 
    <HashRouter>
      <Routes>
        <Route path="/" element={ defaultPage } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/set_password" element={ <SetPassword /> } />
        <Route path="/reset_password" element={ <ResetPassword /> } />
        <Route path="/dashboard" element={ getMainLayoutPage(<Dashboard />) } />
        <Route path="/home" element={ getMainLayoutPage(<Home />) } />
        <Route path="/student-evals" element={ getMainLayoutPage(<StudentEvaluations />) } />
        <Route path="/shop" element={ getMainLayoutPage(<Shop />) } />
        <Route path="/student-evals-details" element={ getMainLayoutPage(<StudentEvaluationsDetails />) } />
        <Route path="/course-analytics" element={ getMainLayoutPage(<CourseAnalytics />) } />
        <Route path="/teamassessments" element={ getMainLayoutPage(<TeamAssessments />) } />
        <Route path="/research-info" element={ getMainLayoutPage(<ResearchInfo />) } />
        <Route path="/grantupload" element={ getMainLayoutPage(<GrantUpload />) } />
        <Route path="/pubupload" element={ getMainLayoutPage(<PubUpload />) } />
        <Route path="/expenupload" element={ getMainLayoutPage(<ExpenUpload />) } />
        <Route path="/evalupload" element={ getMainLayoutPage(<EvalUpload />) } />
        <Route path="/partsupload" element={ getMainLayoutPage(<PartsUpload />) } />
        <Route path="/account-settings" element={ getMainLayoutPage(<AccountSettings />) } />
        <Route path="/useradmin" element={ getMainLayoutPage(<UserAdmin />) } />
        <Route path="*" element={ defaultPage } />
      </Routes>
    </HashRouter>
    : <p>Loading...</p>
  );
}

export default App;
