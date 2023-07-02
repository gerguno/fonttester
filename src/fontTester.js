import React, { useEffect, useState, useRef } from "react";
import textSamplesAndInvestigationsJSON from './textSamplesAndInvestigations.json'
import './fontTester.scss'
import opentype from 'opentype.js'
import Base64Binary from "./base64-binary";
import { useQueryState } from "./useQueryState"
import { Buy } from "./buy";

let textSamplesJSON = [...textSamplesAndInvestigationsJSON.data.textSamples]
let investigationsJSON = [...textSamplesAndInvestigationsJSON.data.investigations]

export default function FontTester({typefaces}) {
  const [f, setF] = useQueryState('f')
  const [typeface, setTypeface] = useState(typefaces[0])
  const [textSamplesDATA, setTextSamplesDATA] = useState(textSamplesJSON)
  const [investigationsDATA, setInvestigationsDATA] = useState(investigationsJSON)
  const [textStyle, setTextStyle] = useState({})
  const [style, setStyle] = useState(typeface.fonts[0].fontTitle.slice(typeface.fonts[0].fontTitle.indexOf(' ') + 1))
  const [showFontStyles, setShowFontStyles] = useState(false)
  const [fontSize, setFontSize] = useState(72);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.2);
  const [uppercase, setUppercase] = useState(false);
  const [alignment, setAlignment] = useState('left');
  const [verticalCenter, setVerticalCenter] = useState(false);
  const [showControls, setShowControls] = useState(true); // !!!!!! -> false
  const [mouseOverControls, setMouseOverControls] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [background, setBackground] = useState('b&w')
  const timerRef = useRef(null);
  const [sampleText, setSampleText] = useState(['The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.'])
  const [textSamplesCat, setTextSamplesCat] = useState([
    {
      name: 'Text samples',
      status: 'active',
    },
    {
      name: 'Investigation',
      status: 'default',
    }
  ])
    
  const handleTypefaceChange = (event) => {
    const foundT = typefaces.find(foundT => foundT.title === event.target.value);
    setTypeface(foundT)
    setF(foundT.slug)
    setSelectedFeatures([])
    let inputs = document.querySelectorAll('.otf-checkbox');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].checked = false;
    }
  };

  const handleStyleChange = (event) => {
    setStyle(event.target.value);
  };

  const handleFontSizeChange = (event) => {
    setFontSize(parseInt(event.target.value));
  };

  const handleLetterSpacingChange = (event) => {
    setLetterSpacing(parseFloat(event.target.value));
  };

  const handleLineHeightChange = (event) => {
    setLineHeight(parseFloat(event.target.value));
  };

  const handleUppercaseChange = () => {
    setUppercase(!uppercase);
  };

  const handleAlignment = () => {
    alignment === 'left' ? setAlignment('center') : setAlignment('left')
  };

  const handleVerticalCenter = () => {
    setVerticalCenter(!verticalCenter);
  };

  const handleMouseOverControls = () => {
    setMouseOverControls(true);
  };

  const handleMouseLeaveControls = () => {
    setMouseOverControls(false);
  };

  const handleCheckboxChange = (event) => {
    const item = event.target.value;
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedFeatures([...selectedFeatures, item]);
    } else {
      setSelectedFeatures(selectedFeatures.filter((value) => value !== item));
    }
  }

  const handleBackground = () => {
    if (background === 'b&w') { 
      setBackground('w&b') 
    }
    else if (background === 'w&b') {
      setBackground('img') 
    } 
    else if (background === 'img') {
      setBackground('b&w')
    } 
  }

  const handleTextSamplesCat = () => {
    (textSamplesCat[0].status === "active") 
      ? setTextSamplesCat([
        {
          name: 'Text samples',
          status: 'default'
        },
        {
          name: 'Investigation',
          status: 'active'
        }
      ])
      : setTextSamplesCat([
        {
          name: 'Text samples',
          status: 'active'
        },
        {
          name: 'Investigation',
          status: 'default'
        }
      ])
  }

  const handleChangeText = (text) => {
    setSampleText(text)
  }

  const universalControls = (
    <> 
      <div id="font-sliders">
        <div>
            <label>
            <input
                type="range"
                min="10"
                max="800"
                value={fontSize}
                onChange={handleFontSizeChange}
            />
            </label>
            <span>{fontSize}</span>
        </div>
        <div>
            <label>
            <input
                type="range"
                min="-0.1"
                max="0.1"
                step="0.01"
                value={letterSpacing}
                onChange={handleLetterSpacingChange}
            />
            </label>
            <span>{Math.floor(letterSpacing*100)}</span>
        </div>
        <div>
            <label>
            <input
                type="range"
                min="0.7"
                max="1.7"
                step="0.01"
                value={lineHeight}
                onChange={handleLineHeightChange}
            />
            </label>
            <span>{lineHeight}</span>
        </div>
      </div>
      <div id="font-toggles">
        <div className="font-toggles-basic">
          <a className="toggle" onClick={handleUppercaseChange}>
            {uppercase 
              ? 
                <>
                  <img src="./case-lowercase-default.png"/>
                  <img src="./case-uppercase-active.png"/>
                </>
              : 
                <>
                  <img src="./case-lowercase-active.png"/>
                  <img src="./case-uppercase-default.png"/>
                </>
            }
          </a>
          <a className="toggle" onClick={handleAlignment}>
            {alignment === 'left'
              ? 
                <>
                  <img src="./align-left-active.png"/>
                  <img src="./align-center-default.png"/>
                </>
              : 
              <>
                <img src="./align-left-default.png"/>
                <img src="./align-center-active.png"/>
              </>
            }
          </a>
          <a className="toggle" onClick={handleVerticalCenter}>
            {verticalCenter
              ? 
                <>
                  <img src="./vcenter-left-default.png"/>
                  <img src="./vcenter-center-active.png"/>
                </>
              : 
              <>
                <img src="./vcenter-left-active.png"/>
                <img src="./vcenter-center-default.png"/>
              </>
            }
          </a>
        </div>
        <a className="toggle-background" onClick={handleBackground}>
          {background === "b&w" && <img src="b&w.png"/>}
          {background === "w&b" && <img src="w&b.png"/>}
          {background === "img" && <img src="img.png"/>}
        </a>
      </div>
  </>)

  const textSamples = (
    <div>
      <div>
        <button onClick={handleTextSamplesCat}>
          <span className={(textSamplesCat[0].status === "default") ? "grey-text" : ""}>{textSamplesCat[0].name}</span>&nbsp;
          <span className={(textSamplesCat[1].status === "default") ? "grey-text" : ""}>{textSamplesCat[1].name}</span>
        </button>
      </div>
      <div className="text-samples">
        {(textSamplesCat[0].status === "active") 
          ? 
            textSamplesDATA.map(ts => {
              return (
                <div>
                  <a onClick={() => handleChangeText(ts.text)}>{ts.name}</a> <br/>
                </div>
            )})
          : 
            investigationsDATA.map(inv => {
              return (
                <div>
                  <a onClick={() => handleChangeText(inv.text)}>{inv.name}</a> <br/>
                </div>
            )})
        }
      </div>
  
    </div>
  )

  useEffect(() => {
    console.log(typefaces)

    for (const t of typefaces) {
      if (t.slug === f) {
        setTypeface(t);
        break;
      }
    }
  }, [])

  useEffect(() => {
    // Check styles if more than 1
    (typeface.fonts.length > 1) ? setShowFontStyles(true) : setShowFontStyles(false)

    // Change default style
    setStyle(typeface.fonts[0].fontTitle.slice(typeface.fonts[0].fontTitle.indexOf(' ') + 1))
  }, [typeface])

  useEffect(() => {
    verticalCenter && setAlignment('center')
    !verticalCenter && setAlignment('left')
  }, [verticalCenter])

  // useEffect(() => {
  //   // Showing controls on mouse move & when hovering
  //   document.addEventListener('mousemove', handleMouseMove);
  //   document.addEventListener('mouseleave', handleMouseLeave);
  //   document.addEventListener('click', handleMouseMove);

  //   if (mouseOverControls) {
  //     setShowControls(true);
  //     clearTimeout(timerRef.current);
  //     document.removeEventListener('mousemove', handleMouseMove);
  //     document.removeEventListener('mouseleave', handleMouseLeave);
  //     document.removeEventListener('click', handleMouseMove);
  //   }

  //   function handleMouseMove() {
  //     setShowControls(true);
  //     clearTimeout(timerRef.current);
  //     timerRef.current = setTimeout(() => {
  //       setShowControls(false);
  //     }, 1000); // 1 second delay before hiding the component
  //   }

  //   function handleMouseLeave() {
  //     clearTimeout(timerRef.current);
  //     setShowControls(false);
  //   }
    
  //   return () => {
  //     document.removeEventListener('mousemove', handleMouseMove);
  //     document.removeEventListener('mouseleave', handleMouseLeave);
  //     document.removeEventListener('click', handleMouseMove);
  //   };
  //   setShowControls(true);
  // }, [mouseOverControls]);

  useEffect(() => {
    if (background === 'b&w') { 
      document.body.style.background = 'white' 
      document.body.style.color = 'black' 
    }
    else if (background === 'w&b') {
      document.body.style.background = 'black'
      document.body.style.color = 'white'
      document.getElementById('controls').style.color = 'black'
    } 
    else if (background === 'img') {
      document.body.style.background = 'url(kvas-people.jpg)'
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundRepeat = 'no-repeat'
      document.body.style.backgroundPosition = '50% 50%'
      document.body.style.backgroundAttachment = 'fixed'
    } 
  }, [background])

  useEffect(() => {
    setTextStyle({
      fontFamily: `${typeface.title} ${style}`,
      fontSize: `${fontSize}px`,
      letterSpacing: `${letterSpacing}em`,
      lineHeight: lineHeight,
      textTransform: `${uppercase ? `uppercase` : `none`}`,
      textAlign: `${alignment}`,
      fontFeatureSettings: selectedFeatures.map((s) => `"${s}"`).join(', ')
    })

  }, [typeface,  style, fontSize, letterSpacing, lineHeight, uppercase, alignment, verticalCenter, selectedFeatures])

  return (
    <div>
        <div id="controls"
            onMouseEnter={handleMouseOverControls} 
            onMouseLeave={handleMouseLeaveControls}
            style={{
            display: `${showControls ? `block` : `none`}`,
        }}>
            <div className="title">
              KTF typesetter V 1.0
            </div>
            <div id="controls-container">
              <div className="font-selectors">
                  <label>
                  <select className="dropdown" value={typeface.title} onChange={handleTypefaceChange}>
                      {typefaces.map((t, id) => (
                          <option key={id} value={t.title}>{t.title}</option>
                      ))}
                  </select>
                  </label>
                  {showFontStyles ? (
                      <label>
                        <select className="dropdown" value={style} onChange={handleStyleChange}>
                            {typeface.fonts.map((f, id) => (
                                <option key={id} value={`${f.fontTitle.slice(f.fontTitle.indexOf(' ') + 1)}`}>{f.fontTitle.slice(f.fontTitle.indexOf(' ') + 1)}</option>
                            ))}
                        </select>
                      </label>
                    ) : <></>}
            </div>
            {universalControls}
            {
              typeface.opentypeFeatures ? (
                <div>
                  OpenType features:
                  <br/>
                    {typeface.opentypeFeatures.map((opf, id) => (
                      <label key={id}>
                        <input type="checkbox" className="otf-checkbox" value={opf.tag} onChange={handleCheckboxChange}/>
                        {opf.tag} {(opf.name) && opf.name} <br/>
                      </label>
                    ))}
                </div>
              ) : <></> 
            }
            {textSamples}
            <Buy slug={typeface.slug}/>
          </div>      
      </div>

      <div id="typefield-container" style={{
        display: `${verticalCenter ? `flex` : `block`}`,
        alignItems: `${verticalCenter ? `center` : `initial`}`,
        justifyContent: `${verticalCenter ? `center` : `initial`}`,
        minHeight: '90vh'
      }}>
        <div id="textfield" style={textStyle} contenteditable="plaintext-only">
            {sampleText}
        </div>
      </div>

    </div>
  );
}