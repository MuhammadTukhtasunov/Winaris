import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ResearchInfoContextProvider } from './context/ResearchInfoContext';
import { StudentEvalsContextProvider } from './context/StudentEvalsContext';
import { ShopContextProvider } from './context/ShopContext';
import { CourseAnalyticsContextProvider } from './context/CourseAnalyticsContext';
import { TeamAssessmentsContextProvider } from './context/TeamAssessmentsContext';
import { DashboardContextProvider } from './context/DashboardContext';
import { HomeContextProvider } from './context/HomeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DashboardContextProvider>
      <HomeContextProvider>
        <AuthContextProvider>
          <ResearchInfoContextProvider>
            <StudentEvalsContextProvider>
              <ShopContextProvider>
                <CourseAnalyticsContextProvider>
                  <TeamAssessmentsContextProvider>
                    <App />
                  </TeamAssessmentsContextProvider>
                </CourseAnalyticsContextProvider>
              </ShopContextProvider>
            </StudentEvalsContextProvider>
          </ResearchInfoContextProvider>
        </AuthContextProvider>
      </HomeContextProvider>
    </DashboardContextProvider>
  </React.StrictMode>
);

