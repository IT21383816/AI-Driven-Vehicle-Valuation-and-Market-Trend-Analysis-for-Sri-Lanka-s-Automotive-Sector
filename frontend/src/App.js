import "./App.css";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DamagePrediction from "./components/DamagePrediction";
import ValuationPrediction from "./components/ValuationPrediction";
import EcoPrediction from "./components/EcoPrediction";
import PricePrediction from "./components/PricePrediction";
import Price from "./components/Price";
import Feedback from "./components/Feedback";
import ButterToast, { POS_RIGHT, POS_TOP } from "butter-toast";

function App() {
  return (
    <Router>
      <div
        className="App"
        style={{
          backgroundImage: "url(/bg.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          width: "100%",
        }}
      >
        <div className="mainDiv">
          <Switch>
          <Route path="/feedback" component={Feedback}></Route>
          <Route path="/price" component={PricePrediction}></Route>
          <Route path="/v_price" component={Price}></Route>
          <Route path="/eco" component={EcoPrediction}></Route>
          <Route path="/valuation" component={ValuationPrediction}></Route>
            <Route path="/" component={DamagePrediction}></Route>
          </Switch>
          <ButterToast position={{ vertical: POS_TOP, horizontal: POS_RIGHT }} />
        </div>
      </div>
    </Router>
  );
}

export default App;
