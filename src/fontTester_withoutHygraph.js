import React, { useEffect, useState, useRef } from "react";
import typefacesJSON from './typefaces.json'
import textSamplesAndInvestigationsJSON from './textSamplesAndInvestigations.json'
import './fontTester.css'
import opentype from 'opentype.js'
import Base64Binary from "./base64-binary";

let typefaces = [...typefacesJSON.data.typefaces]
let textSamplesJSON = [...textSamplesAndInvestigationsJSON.data.textSamples]
let investigationsJSON = [...textSamplesAndInvestigationsJSON.data.investigations]

export default function FontTester() {
  const [typeface, setTypeface] = useState(typefaces[0])
  const [textSamplesDATA, setTextSamplesDATA] = useState(textSamplesJSON)
  const [investigationsDATA, setInvestigationsDATA] = useState(investigationsJSON)
  const [customTypeface, setCustomTypeface] = useState({})
  const [customTypefacePopulated, setCustomTypefacePopulated] = useState(false)
  const [textStyle, setTextStyle] = useState({})
  const [style, setStyle] = useState(typeface.fonts[0].fontTitle.slice(typeface.fonts[0].fontTitle.indexOf(' ') + 1))
  const [showFontStyles, setShowFontStyles] = useState(false)
  const [fontSize, setFontSize] = useState(72);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.2);
  const [uppercase, setUppercase] = useState(false);
  const [alignment, setAlignment] = useState('left');
  const [verticalCenter, setVerticalCenter] = useState(false);
  const [showControls, setShowControls] = useState(false);
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

  const handleAlignment = (event) => {
    setAlignment(event.target.value)
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

  const handleFileChange = (event) => {
    setCustomTypeface({})
    setCustomTypefacePopulated(false)
    setSelectedFeatures([])

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function() {
      const base64 = btoa(reader.result);
      setCustomTypeface({base64: base64})
    };
    reader.readAsBinaryString(file);
  }

  const handleRemoveCustomTypeface = () => {
    setCustomTypeface({})
    setCustomTypefacePopulated(false)
    setSelectedFeatures([])
    document.getElementById("drag-n-drop").value = "";
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
    <div id="universal-controls"> 
    <div>
        <label>
        size
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
        spacing
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
        leading
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
    <div>
      <a onClick={handleUppercaseChange}>
        {uppercase ? 'AA' : 'Aa' }
      </a>
    </div>
    <div>
      <button
        value="left"
        onClick={handleAlignment}
        style={{ backgroundColor: alignment === 'left' ? 'pink' : 'grey' }}
      >
        Left
        {/* add image through background image */}
      </button>
      <button
        value="center"
        onClick={handleAlignment}
        style={{ backgroundColor: alignment === 'center' ? 'pink' : 'grey' }}
      >
        Center
        {/* add image through background image */}
      </button>
    </div>
    <div>
      <a onClick={handleVerticalCenter}>
        {verticalCenter ? '[•]' : '[⌜]' }
      </a>
    </div>
    <div>
      <a onClick={handleBackground}>
        {background === "b&w" && <img src="b&w.png"/>}
        {background === "w&b" && <img src="w&b.png"/>}
        {background === "img" && <img src="img.png"/>}
      </a>
    </div>
  </div>)

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
    console.log(textSamplesDATA)
    // Load fonts
    typefaces.map((t) => {
      t.fonts.map((f, i) => {
          const fontFace = new FontFace(`${t.title} ${f.fontTitle.slice(f.fontTitle.indexOf(' ') + 1)}`, `url(data:application/octet-stream;base64,${f.base64})`);
          document.fonts.add(fontFace);
      })
    })

    // Add font features data from base64s to typefaces array 
    // Base64 Must be of WOFF, not WOFF2
    // Use this https://www.giftofspeed.com/base64-encoder

    for (let i=0; i < typefaces.length; i++) {
      async function parse() {
        const font = await opentype.parse(Base64Binary.decodeArrayBuffer(typefaces[i].fonts[0].base64))
        const features = [...Array.from(new Set(font.tables.gsub.features.map((f) => f.tag)))].map(tag => ({tag}))

        // Names 256-32767
        let fontNames = []
        let counter = 0

        if (font.names.hasOwnProperty('256')) {
          for (let key in font.names) {
              if (/^\d+$/.test(key)) {
                for (let n in font.names[key]) {
                  fontNames.push(font.names[key][n])
                }
              }
            }
          }
          if (fontNames.length > 0) {
            for (let i=0; i < features.length; i++) {
              if (features[i].tag.includes('ss')) {
                features[i]['name'] = fontNames[counter]
                counter++
              }
            }
          }
          typefaces[i]['opentypeFeatures'] = features
          return null
      }

      parse()
    }
    // console.log(typefaces)
  }, []);

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

  useEffect(() => {
    // Showing controls on mouse move & when hovering
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('click', handleMouseMove);

    if (mouseOverControls) {
      setShowControls(true);
      clearTimeout(timerRef.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('click', handleMouseMove);
    }

    function handleMouseMove() {
      setShowControls(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 1000); // 1 second delay before hiding the component
    }

    function handleMouseLeave() {
      clearTimeout(timerRef.current);
      setShowControls(false);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('click', handleMouseMove);
    };
    setShowControls(true);
  }, [mouseOverControls]);

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
    } 
  }, [background])

  useEffect(() => {
    if (customTypeface.base64 && !customTypefacePopulated) {
      async function parse() {
        const font = await opentype.parse(Base64Binary.decodeArrayBuffer(customTypeface.base64))
        const features = [...Array.from(new Set(font.tables.gsub.features.map((f) => f.tag)))].map(tag => ({tag}))
        
        console.log(font)
        
        // OpenType features names 256-32767
        let fontNames = []
        let counter = 0
        let typefaceTitle
        
        for (let n in font.names.fullName) {
          typefaceTitle = font.names.fullName[n]
        }
        
        // Info on names table https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6name.html
  
        if (font.names.hasOwnProperty('256')) {
          for (let key in font.names) {
              if (/^\d+$/.test(key) && parseInt(key) > 255) {
                for (let n in font.names[key]) {
                  if (
                    font.names[key][n] !== "Weight" &&
                    font.names[key][n] !== "Width" && 
                    font.names[key][n] !== "Italic" && 
                    font.names[key][n] !== "Slant" && 
                    font.names[key][n] !== "Optical size"
                  ) {
                    fontNames.push(font.names[key][n])
                  }
                }
              }
            }
          }
          if (fontNames.length > 0) {
            for (let i=0; i < features.length; i++) {
              if (features[i].tag.includes('ss')) {
                features[i]['name'] = fontNames[counter]
                counter++
              }
            }
          }
          setCustomTypeface({
            ...customTypeface,
            opentypeFeatures: features,
            typefaceTitle: typefaceTitle
          })

          setCustomTypefacePopulated(true)

          return null
      }
      parse()
    }
  }, [customTypeface])

  useEffect(() => {
    setTextStyle({
      fontFamily: (!customTypefacePopulated) ? `${typeface.title} ${style}` : `${customTypeface.typefaceTitle}`,
      fontSize: `${fontSize}px`,
      letterSpacing: `${letterSpacing}em`,
      lineHeight: lineHeight,
      textTransform: `${uppercase ? `uppercase` : `none`}`,
      textAlign: `${alignment}`,
      fontFeatureSettings: selectedFeatures.map((s) => `"${s}"`).join(', ')
    })
  }, [typeface, customTypeface, customTypefacePopulated, style, fontSize, letterSpacing, lineHeight, uppercase, alignment, verticalCenter, selectedFeatures])

  useEffect(() => {
    // Load customTypeface
    const fontFace = new FontFace(`${customTypeface.typefaceTitle}`, `url(data:application/octet-stream;base64,${customTypeface.base64})`);
    document.fonts.add(fontFace);
  }, [customTypefacePopulated])

  return (
    <div>
        <div id="controls"
            onMouseEnter={handleMouseOverControls} 
            onMouseLeave={handleMouseLeaveControls}
            style={{
            display: `${showControls ? `block` : `none`}`,
            width: '360px',
            borderRadius: '4px',
            backgroundColor: 'rgba(217, 217, 217, 0.95)',
            backdropFilter: 'blur(60px)',
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            padding: '16px',
        }}>
            <div>
              <input id="drag-n-drop" type="file" accept=".ttf,.otf,.woff" onChange={handleFileChange} />
              {customTypefacePopulated && 
                <a onClick={handleRemoveCustomTypeface}>
                    Remove
                </a>
              }
            </div>
            {
              !customTypefacePopulated 
                ? 
                  (
                    <div id="ktf-fonts">
                    <div>
                        <label>
                        Font family:
                        <select value={typeface.title} onChange={handleTypefaceChange}>
                            {typefaces.map((t, id) => (
                                <option key={id} value={t.title}>{t.title}</option>
                            ))}
                        </select>
                        </label>
                    </div>
                    {
                      showFontStyles ? (
                          <div>
                              <label>
                              Font styles:
                              <select value={style} onChange={handleStyleChange}>
                                  {typeface.fonts.map((f, id) => (
                                      <option key={id} value={`${f.fontTitle.slice(f.fontTitle.indexOf(' ') + 1)}`}>{f.fontTitle.slice(f.fontTitle.indexOf(' ') + 1)}</option>
                                  ))}
                              </select>
                              </label>
                          </div>
                      ) : <></>
                    }
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
                  </div>      
                  )
                :
                  (
                    <div id="custom-font">
                      {universalControls}
                      {
                        customTypeface.opentypeFeatures ? (
                          <div>
                            OpenType features:
                            <br/>
                              {customTypeface.opentypeFeatures.map((opf, id) => (
                                <label key={id}>
                                  <input type="checkbox" className="otf-checkbox" value={opf.tag} onChange={handleCheckboxChange}/>
                                  {opf.tag} {(opf.name) && opf.name} <br/>
                                </label>
                              ))}
                          </div>
                        ) : <></> 
                      }
                      {textSamples}
                    </div>      
                  )
            }
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