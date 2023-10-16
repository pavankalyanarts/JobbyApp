import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/HomePage'
import JobsFeed from './components/JobsFeed'
import JobItemDetails from './components/JobItemDetails'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'
import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={LoginForm} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/jobs" component={JobsFeed} />
      <ProtectedRoute exact path="/jobs/:id" component={JobItemDetails} />
      <Route exact path="/not-found" component={NotFound} />
      <Redirect to="/not-found" />
    </Switch>
  </BrowserRouter>
)

export default App
