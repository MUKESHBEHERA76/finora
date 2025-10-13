import "./stocks.css";

function Stocks() {
  return (
    <div className="stocks-page">
      <header className="stocks-header">
        <p>Home / Stocks</p>
      </header>

      <div className="button-container">
        <button className="my-btn"><img width="30" height="30" src="https://img.icons8.com/cotton/128/plus--v2.png" alt="plus--v2"/>Declare stocks</button>
      </div>
    </div>
  );
}

export default Stocks;
