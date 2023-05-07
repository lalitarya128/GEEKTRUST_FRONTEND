import './App.css';
import Products from "./components/Products";
import Cart from "./components/Cart";
import { BrowserRouter,Switch, Route } from 'react-router-dom';

export const endpoint = `https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart`;

function App() {
  return (
    <BrowserRouter>
      <div className="App">
          <Switch>
            <Route  path={"/cart"}  component={Cart} />   
            <Route extact path={"/"}  component={Products} /> 
          </Switch>
        
      </div>
    </BrowserRouter>
  );
}

export default App;
