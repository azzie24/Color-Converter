import React, { useState } from 'react';
import { HuePicker, SwatchesPicker } from 'react-color';
import { rgbToCmyk, cmykToRgb, rgbToHsv, hsvToRgb } from './colorFunctions'; 
import './App.css';
import './sliders.css'

function App() {
  const [color, setColor] = useState({ r: 255, g: 0, b: 0, a: 1 }); //default state
  const [cmyk, setCmyk] = useState({ c: 0, m: 1, y: 1, k: 0 });
  const [hsv, setHsv] = useState({ h: 0, s: 1, v: 1 });
  const [showWarning, setShowWarning] = useState(false);

  const handleColorChange = (newColor) => {
    const { r, g, b, a } = newColor.rgb;
    setColor({ r, g, b, a });

    setCmyk(rgbToCmyk(r, g, b));
    setHsv(rgbToHsv(r, g, b));
  };

  const handleRgbChange = (e) => {
    const { name, value } = e.target;
    const newValue = Math.max(0, Math.min(255, parseInt(value, 10))); 
    const updatedColor = { ...color, [name]: newValue };
    setColor(updatedColor);
    const { r, g, b } = updatedColor;
    setCmyk(rgbToCmyk(r, g, b));
    setHsv(rgbToHsv(r, g, b));
    if (newValue === 0 || Math.abs(r - g )<= 20 || Math.abs(g - b) <=20 || Math.abs(r-b) <= 20) {
      setShowWarning(true);
    } else {
      setShowWarning(false); 
    }
  };

  const handleCmykChange = (e) => {
    const { name, value } = e.target;
    const newValue = Math.max(0, Math.min(100, parseFloat(value))); 
    const updatedCmyk = { ...cmyk, [name]: newValue / 100 }; 
    setCmyk(updatedCmyk);
    const { c, m, y, k } = updatedCmyk;
    const rgb = cmykToRgb(c, m, y, k);
    setColor({ ...rgb, a: color.a });
    setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
  };

  const handleHsvChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'h' ? Math.max(0, Math.min(360, parseInt(value, 10))) : Math.max(0, Math.min(100, parseFloat(value))); 
    const updatedHsv = {
      ...hsv,
      [name]: name === 'h' ? newValue : newValue / 100, 
    };
    setHsv(updatedHsv);
    const { h, s, v } = updatedHsv;
    const rgb = hsvToRgb(h, s, v);
    setColor({ ...rgb, a: color.a });
    setCmyk(rgbToCmyk(rgb.r, rgb.g, rgb.b));
  };

  const colorString = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

  return (
    <div style={{ backgroundColor: colorString, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', position: 'relative', minHeight: '100vh' }}>
      <div
        id="rectangle"
        style={{
          backgroundColor: '#ffffff',
          width: '80%',
          height: '89vh',
          position: 'absolute',
          top: '47%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: '1',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px ',
        }}
      />

      <div style={{ zIndex: '2', fontFamily: 'sans-serif' }}> 
        <h1>Color Converter</h1>
        {/* Wrapper for Pickers */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <SwatchesPicker color={color} onChange={handleColorChange} />
          <HuePicker color={color} onChange={handleColorChange} />
        </div>

        {/* Container for RGB, CMYK, HSV Models */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          
          {/* RGB Inputs and Sliders */}
          <div style={{ marginTop: '20px', flex: 1, marginRight: '20px' }}>
            <h3>RGB</h3>
            {['r', 'g', 'b'].map((channel) => (
    <div key={channel} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <label style={{ marginRight: '10px', fontWeight: 'bold', width: '20px' }}>
        {channel.toUpperCase()}:
      </label>
                <input
                  type="number"
                  name={channel}
                  value={color[channel]}
                  onChange={handleRgbChange}
                  min="0"
                  max="255"
                />
                <input
                  type="range"
                  name={channel}
                  value={color[channel]}
                  onChange={handleRgbChange}
                  min="0"
                  max="255"
                  className={`slider slider-${channel}`}
                />
              </div>
            ))}
          </div>

          {/* CMYK Inputs and Sliders */}
          <div style={{ marginTop: '20px', flex: 1, marginRight: '20px' }}>

  <h3>CMYK</h3>
  {['c', 'm', 'y', 'k'].map((channel) => (
    <div key={channel} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <label style={{ marginRight: '10px', fontWeight: 'bold', width: '20px' }}>
        {channel.toUpperCase()}:
      </label>
      <input
        type="number"
        name={channel}
        value={Math.round(cmyk[channel] * 100)}
        onChange={handleCmykChange}
        min="0"
        max="100"
        step="1"
        style={{ marginRight: '10px' }}
      />
      <input
        type="range"
        name={channel}
        value={Math.round(cmyk[channel] * 100)}
        onChange={handleCmykChange}
        min="0"
        max="100"
        className={`slider slider-${channel}`}
      />
    </div>
  ))}
</div>

  {/* HSV Inputs and Sliders */}
  <div style={{ marginTop: '20px', flex: 1 }}>
  <h3>HSV</h3>
  {['h', 's', 'v'].map((channel) => (
    <div key={channel} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <label style={{ marginRight: '10px', fontWeight: 'bold', width: '20px' }}>
        {channel.toUpperCase()}:
      </label>
      <input
        type="number"
        name={channel}
        value={channel === 'h' ? hsv[channel] : Math.round(hsv[channel] * 100)}
        onChange={handleHsvChange}
        min={channel === 'h' ? '0' : '0'}
        max={channel === 'h' ? '360' : '100'}
        style={{ marginRight: '10px' }}
      />
      <input
        type="range"
        name={channel}
        value={channel === 'h' ? hsv[channel] : Math.round(hsv[channel] * 100)}
        onChange={handleHsvChange}
        min={channel === 'h' ? '0' : '0'}
        max={channel === 'h' ? '360' : '100'}
        className={`slider slider-${channel}`}
      />
    </div>
  ))}
</div>
</div>

        {showWarning && (
          <p style={{ color: 'red', fontSize: '14px', position: 'absolute', top: '78%',
            left: '40%'}}>
            Highly saturated colors may not be converted accurately!
            </p>
        )}
      </div>
    </div>
  );
}
export default App;
