import React, { useState, useEffect, useRef } from 'react';
import { LIMITED_GRANTS_URL, LIMITED_PUBS_URL, LIMITED_EXPEN_URL, LIMITED_EVALS_URL, COURSE_ANALYTICS_URLS } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useHomeContext } from '../../hooks/useHomeContext';
import { useNavigate } from "react-router-dom";
import plot_kde from '../../utils/plot_kde'
import './home.css';

async function getHomeData(route, dispatch, action, setError) {
  const response = await fetch(route, {
    method: 'GET',
    credentials: 'include'
  })
  const json = await response.json()
  if (response.ok) {
    dispatch({type: action, payload: json})
    return json
  }
  else {
    setError(json.error ? json.error : 'Error')
    return json
  }
}

const Home = () => {
  const navigate = useNavigate()

  const { user } = useAuthContext()
  const { grants, pubs, expens, courses, anonData, plot, homeDispatch } = useHomeContext()

  const [grantsError, setGrantsError] = useState('');
  const [pubsError, setPubsError] = useState('');
  const [expensError, setExpensError] = useState('');
  const [coursesError, setCoursesError] = useState('');
  const [analyticsError, setAnalyticsError] = useState('');
  const [plottingError, setPlottingError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);

  useEffect(() => {
    const getData = async () => {
      // Get data for each card
      if (!pubs) {
        getHomeData(LIMITED_PUBS_URL, homeDispatch, 'SET_PUBS', setPubsError)
      } 
      if (!grants) {
        getHomeData(LIMITED_GRANTS_URL, homeDispatch, 'SET_GRANTS', setGrantsError)
      }
      if (!expens) {
        getHomeData(LIMITED_EXPEN_URL, homeDispatch, 'SET_EXPENS', setExpensError)
      }
      if (!courses) {
        getHomeData(LIMITED_EVALS_URL, homeDispatch, 'SET_COURSES', setCoursesError)
      }
      if (courses && !anonData) {
        const data = await getHomeData(
          COURSE_ANALYTICS_URLS.getAnonData + `/${courses[0].course}/1000`, 
          homeDispatch, 
          'SET_ANON_DATA', 
          setAnalyticsError
        )
        if (data.plots) {
          if (data.plots.error) {
            setPlottingError(data.plots.error)
          }
          else {
            const {data: plotData, layout: plotLayout} = JSON.parse(data.plots.course_rating_plot)
            
            homeDispatch({type: 'SET_PLOT', payload: {data: plotData, layout: plotLayout}})
            setPlottingError('')
          }
        }
      }
    }
    getData()
  }, [grants, pubs, courses, anonData, homeDispatch])

  // const Plot = createPlotlyComponent(Plotly);
  const [courseRatingsPlot, setCourseRatingsPlot] = useState(null)
  
  useEffect(() => {
    if (plot && user && courses) {
      setCourseRatingsPlot(plot_kde(plot.data, plot.layout, 'Your', courses[0].ave_course_rating_mean, 'Course'))
    }
  }, [plot, user, courses])
  console.log(anonData, analyticsError, plot, plottingError)
  return (
    <div>
      <h1 className='pageHeader'>Home</h1>
      <div className='homeBody'>
        
        { user && (user.position === 'chair' || user.position === 'professor') ?
          <div className='homeCard'>
            <div className='homeCardHeader'>
              <h1>Shop</h1>
              <button onClick={ (e) => navigate('/research-info?page=grants') }>See All</button>
            </div>
            <div className="homeCardContent">
              {grantsError && <p className='HomeError'>{grantsError}</p>}
                { grants ?
                  <ol className="grantList">
                    { grants.map((grant) => {
                      return (
                        <li key={ grant.title }>
                          <p className="grantTitle">{ grant.title }</p>
                          <p className="grantInfo">${ grant.amount }; <i>{grant.year}</i></p>
                        </li>
                      )
                    })}
                  </ol>
                  : grantsError ? '' : <p>Loading...</p>
                }
              </div>
            </div> : ''
        }


        { user && (user.position === 'chair' || user.position === 'professor') ?
          <div className='homeCard'>
            <div className='homeCardHeader'>
              <h1>Grants</h1>
              <button onClick={ (e) => navigate('/research-info?page=grants') }>See All</button>
            </div>
            <div className="homeCardContent">
              {grantsError && <p className='HomeError'>{grantsError}</p>}
                { grants ?
                  <ol className="grantList">
                    { grants.map((grant) => {
                      return (
                        <li key={ grant.title }>
                          <p className="grantTitle">{ grant.title }</p>
                          <p className="grantInfo">${ grant.amount }; <i>{grant.year}</i></p>
                        </li>
                      )
                    })}
                  </ol>
                  : grantsError ? '' : <p>Loading...</p>
                }
              </div>
            </div> : ''
        }
        { user && (user.position === 'chair' || user.position === 'professor') ?
          <div className='homeCard'>
            <div className='homeCardHeader'>
              <h1>Publications</h1>
              <button onClick={ (e) => navigate('/research-info?page=publications') }>See All</button>
            </div>
            <div className="homeCardContent">
              {pubsError && <p className='HomeError'>{pubsError}</p>}
                { pubs ?
                  <ol className="publicationList">
                    { pubs.map((pub) => {
                      return (
                        <li key={ pub.title }>
                          <p>{ pub.title }</p>
                          <p className="publicationInfo">{pub.authors}; <i>{pub.publication_year}</i></p>
                          <p className="publicationInfo">{pub.isbn ? `ISBN: ${pub.isbn}` : ''}</p>
                        </li>
                      )
                    })}
                  </ol>
                  : pubsError ? '' : <p>Loading...</p>
                }
              </div>
            </div>: ''
        }
        { user && (user.position === 'chair' || user.position === 'professor') ?
          <div className='homeCard homeExpenCard'>
            <div className='homeCardHeader'>
              <h1>Expenditures</h1>
              <button onClick={ (e) => navigate('/research-info?page=expenditures') }>See All</button>
            </div>
            <div className="homeCardContent">
              {expensError && <p className='HomeError'>{expensError}</p>}
              <div className="homeTable">
                { expens ?
                  <table className="expensTable">
                    <thead>
                      <tr>
                        <th>Calendar Year</th>
                        <th>Reporting Department</th>
                        <th>P.I.</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                    { expens.map((ex,i) => {
                      return (
                        <tr key={ i }>
                            <td>{ ex.year }</td>
                            <td>{ ex.reporting_department }</td>
                            <td>{ ex.pi_name }</td>
                            <td>{ ex.amount }</td>
                        </tr>
                      )
                    })}
                    </tbody>
                  </table>
                  : expensError ? '' : <p>Loading...</p>
                }
              </div>
            </div>
          </div> : ''
        }
        <div className={ `homeCard ${user?.position === 'instructor' ? 'instructorCard' : ''}` }>
          <div className='homeCardHeader'>
            <h1>Student Evals</h1>
            <button onClick={ (e) => navigate('/student-evals') }>See All</button>
          </div>
          <div className="homeCardContent">
            {coursesError && <p className='HomeError'>{coursesError}</p>}
            <div className="homeTable">
              { courses ?
                <table className="studentEvalsTable">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Ave. Course Rating</th>
                      <th>Ave. Instr. Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                  { courses.map((course) => {
                    return (
                      <tr key={ course.course }>
                        <td>{ course.course }</td>
                        <td>{ course.ave_course_rating_mean.toFixed(2) }</td>
                        <td>{ course.ave_instructor_rating_mean.toFixed(2) }</td>
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
                : coursesError ? '' : <p>Loading...</p>
              }
            </div>
          </div>
        </div>
        <div className='homeCard homePlotCard'>
          <div className='homeCardHeader'>
            <h1>Course Analytics</h1>
            <button onClick={ (e) => navigate('/course-analytics') }>See All</button>
          </div>
          <div className="homeCardContent">
            <h2>{ courses?.[0]?.course }</h2>
            { coursesError ? <p className='HomeError'>{coursesError}</p> :
              anonData ?
                  plot ? 
                    <div className="homePlot">
                      { courseRatingsPlot }
                    </div>
                    : plottingError ? <p className='HomeError'>{ plottingError }</p> : ''
                  : analyticsError ? <p className='HomeError'>{ analyticsError }</p> : <p>Loading...</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
