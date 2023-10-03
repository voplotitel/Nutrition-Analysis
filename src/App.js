import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [ingredients, setIngredients] = useState('1 bananas');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setIngredients(e.target.value);
  };

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      if (ingredients.trim() === '') {
        throw new Error('Enter ingredients');
      }

      const myAppId = 'acc68b15';
      const myAppKey = '881637c994395eccf1a6aa5ddccb2e71';

      const response = await fetch(
        `https://api.edamam.com/api/nutrition-data?app_id=${myAppId}&app_key=${myAppKey}&nutrition-type=cooking&ingr=${encodeURIComponent(
          ingredients
        )}`
      );

      if (response.ok) {
        const data = await response.json();

        if (Object.keys(data).length === 0) {
          throw new Error('Ingredients not recognized');
        }

        setResult(data);
      } else {
        throw new Error('HTTP Error: ' + response.status);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [ingredients]);

  useEffect(() => {
    if (ingredients.trim() === '') {
      return;
    }
    handleSubmit();
  }, [ingredients, handleSubmit]);

  return (
    <div className="container">
      <h1>Nutrition Analysis</h1>
      <input
        type="text"
        placeholder="Enter ingredients"
        value={ingredients}
        onChange={handleChange}
      />
      <div>
        <button onClick={handleSubmit} disabled={loading}>
          Analyze
        </button>
        <button onClick={() => setIngredients('')} disabled={loading}>
          Reset
        </button>
      </div>
      {loading && (
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      {result && (
        <div id="result">
          <h2>Results:</h2>
          {Object.keys(result).length === 0 ? (
            <p>Ingredients not recognized.</p>
          ) : (
            <div>
              <p>Calories: {Math.round(result.calories)}</p>
              <h3>Important Nutrients:</h3>
              <ul>
                {Object.keys(result.totalNutrients).map((key) => (
                  <li key={key}>
                    {result.totalNutrients[key].label}:{' '}
                    {Math.round(result.totalNutrients[key].quantity)}{' '}
                    {result.totalNutrients[key].unit}
                  </li>
                ))}
              </ul>
              <h3>Recommended Daily Intake:</h3>
              <ul>
                {Object.keys(result.totalDaily).map((key) => (
                  <li key={key}>
                    {result.totalDaily[key].label}:{' '}
                    {Math.round(result.totalDaily[key].quantity)}{' '}
                    {result.totalDaily[key].unit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {error && <div id="error">Error: {error}</div>}
    </div>
  );
}

export default App;