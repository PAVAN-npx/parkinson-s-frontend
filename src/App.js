import React, { useState } from 'react';
import Input from './component/Input'
import './App.css'

const App= () => {
  const labels = [
    'MDVP:Fo(Hz)', 'MDVP:Fhi(Hz)', 'MDVP:Flo(Hz)', 'MDVP:Jitter(%)', 'MDVP:Jitter(Abs)', 
    'MDVP:RAP', 'MDVP:PPQ', 'Jitter:DDP', 'MDVP:Shimmer', 'MDVP:Shimmer(dB)', 
    'Shimmer:APQ3', 'Shimmer:APQ5', 'MDVP:APQ', 'Shimmer:DDA', 'NHR', 
    'HNR', 'RPDE', 'DFA', 'spread1', 'spread2','D2', 'PPE'
  ];
  

  const [formValues, setFormValues] = useState(['119.992', '157.302', '74.997', '0.00784', '0.00007', '0.00370', '0.00554', '0.01109', '0.04374', '0.42600', '0.02182', '0.03130', '0.02971', '0.06545', '0.02211', '21.033', '0.414783', '0.815285', '-4.813031', '0.266482', '2.301442', '0.284654']);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  const handleNext = () => {
    if (inputValue.trim() !== '') {
      const newValues = [...formValues];
      newValues[currentIndex] = inputValue;
      setFormValues(newValues);
      setInputValue(newValues[currentIndex + 1] || '');

      if (currentIndex < labels.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newValues = [...formValues];
      newValues[currentIndex] = inputValue;
      setFormValues(newValues);
      setInputValue(newValues[currentIndex - 1]);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleJumpToIndex = (index) => {
    setCurrentIndex(index);
    setInputValue(formValues[index]);
  };

  const handleInputChange = (e) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);

    // Update the current input value in formValues
    const newValues = [...formValues];
    newValues[currentIndex] = newInputValue;
    setFormValues(newValues);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('Final Submitted Values:', formValues);
    // Handle form submission logic
    e.preventDefault();

    try {
      const response = await fetch('https://parkinsons-detection-avxi.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: formValues.map((item) => parseFloat(item)), // convert to list of numbers
        }),
      });

      const responseData = await response.json();
      console.log(responseData)
      setResult(responseData.prediction);
      if (responseData.prediction=="no") {
        console.log(result)
        setResult('This Person Does Not Have Parkinsons Disease')
        
      } else {
        setResult('This Person Has  Parkinsons Disease')
        
      }
      console.log(result);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }




  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Form section */}
      <form onSubmit={handleSubmit}>
        <div className='ipn'>
          <div >
            
            <Input
              type="number"
              data={inputValue}
              onChange={handleInputChange}
              label= {labels[currentIndex]}
            />
          
        </div>

        <div style={{ marginTop: '10px' }}>
          <button type="button" className='pn' onClick={handlePrevious} disabled={currentIndex === 0}>
            Previous
          </button>
          <button type="button"  className='pn' onClick={handleNext}>
            {currentIndex < labels.length - 1 ? 'Next' : 'Finish'}
          </button>
          </div>
         
        </div>
      </form>

      {/* Display input values as buttons */}
      <div>
        
        <div class='btnar'>
          {labels.map((label, index) => (
            <div><button
            class="Btn"
              key={index}
              type="button"
              onClick={() => handleJumpToIndex(index)}
              style={{
                
                margin: '5px 0',
                padding: '8px 12px',
                backgroundColor: currentIndex === index ? 'grey' : 'black',
                
              }}
            >
              {label}: {formValues[index] || 'Not entered yet'}
            </button></div>
          ))}
          <div>

          <button className='smt' onClick={handleSubmit}>
  <span class="transition"></span>
  <span class="gradient"></span>
  <span class="label">submit</span>
</button>

          </div>
         
        </div>

        {/* Display all form values as a comma-separated string */}
        <div style={{ marginTop: '20px' }}>
          <h3>All Values:</h3>
          <p>{formValues.join(', ')}</p>

          <div style={{color: 'whitesmoke',
          position: 'absolute',
          top:'20%',
          left: '45%',
          scale:'1.5',

            
          }}>{result}</div>
        </div>
      </div>
    </div>
  );
};

export default App;
