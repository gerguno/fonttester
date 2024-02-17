import React, { useEffect, useState, useRef } from "react";
import textSamplesAndInvestigationsJSON from '../data/textSamplesAndInvestigations.json'
import { useQueryState } from "../utils/useQueryState"
import { Buy } from "./buy";
import useWindowDimensions from "../utils/useWindowDimensions"
import gsap from "gsap";

let textSamplesJSON = [...textSamplesAndInvestigationsJSON.data.textSamples]
let dTJSON = textSamplesAndInvestigationsJSON.data.defaultText

export default function FontTester({source}) {
  const [typefaces, setTypefaces] = useState(source);
  const [app, setApp] = useState({
    controls: {
      fontSize: window.innerWidth > 768 ? 120 : 36,
      letterSpacing: 0,
      lineHeight: 1.2,
      uppercase: false,
      alignment: 'left',
      verticalCenter: false,
      background: 'b&w',
      fontFeatureSettings: '',
    },
    texts: {
      textSamplesDATA: textSamplesJSON,
      sampleText: [dTJSON],
    }
  })

  const [markers, setMarkers] = useState({
      showFontsDropdown: typefaces.find(t => t.selected)?.fonts.length > 1,
      showControls: true,
      mouseOverControls: false,
  })

  const timerRef = useRef(null);
  const [queries, setQueries] = useQueryState({ t: '', f: '' });
  const { height, width } = useWindowDimensions();

  const updateFontFeatures = () => {
    let newFontFeatureSettings = '';
  
    typefaces.forEach(t => {
      if (t.selected) {
        t.fonts.forEach(f => {
          if (f.selected) {
            f.opentypeFeatures.forEach(feature => {
              if (feature.selected) {
                newFontFeatureSettings += `"${feature.tag}", `;
              }
            });
          }
        });
      }
    });
  
    newFontFeatureSettings = newFontFeatureSettings.replace(/, $/, '');
  
    setApp(prev => ({
      ...prev,
      controls: {
        ...prev.controls,
        fontFeatureSettings: newFontFeatureSettings
      }
    }));
  }
  
  const handleTypefaceChange = (e) => {
    // Update selected typeface
    let updatedTypefaces = typefaces.map(t => {
      if (t.slug === e.target.value) {
        return { ...t, selected: true };
      }
      return { ...t, selected: false };
    });

    // Update default selected font
    updatedTypefaces.forEach((t, i) => {
      if (t.selected) {
        t.fonts.forEach((f, i) => {
          if (i === 0) {
            f.selected = true
          }
          else {
            f.selected = false
          }
        })
      } else {
        t.fonts.forEach((f, i) => {
          f.selected = false
        })
      }
    })

    // Show font styles dropdown if there are more than one font styles
    if (updatedTypefaces.find(t => t.selected)?.fonts.length > 1) {
      setMarkers(prev => ({
        ...prev,
        showFontsDropdown: true
      }))
    } else {
      setMarkers(prev => ({
        ...prev,
        showFontsDropdown: false
      }))
    }

    setTypefaces(updatedTypefaces);
    setQueries({t: e.target.value, f: updatedTypefaces.find(t => t.selected)?.fonts.find(f => f.selected)?.fontTitle})

    // updateFontFeatures() -> moved to useEffect
  };

  const handleFontChange = (e) => {
    const updatedTypefaces = typefaces.map(typeface => {
      if (typeface.selected) {
        return {
          ...typeface, 
          fonts: typeface.fonts.map(font => ({
            ...font,
            selected: font.fontTitle === e.target.value, 
          })),
        };
      }
      return typeface; 
    });
  
    setTypefaces(updatedTypefaces);
    setQueries({t: updatedTypefaces.find(t => t.selected)?.slug, f: updatedTypefaces.find(t => t.selected)?.fonts.find(f => f.selected)?.fontTitle})
    // updateFontFeatures() -> moved to useEffect
  };

  const handleFontSizeChange = (event) => {
    setApp(prev => ({
      ...prev,
      controls: {
        ...prev.controls,
        fontSize: event.target.value
      }
    }))
  };

  const handleLetterSpacingChange = (event) => {
    setApp(prev => ({
      ...prev,
      controls: {
        ...prev.controls,
        letterSpacing: event.target.value
      }
    }))
  };

  const handleLineHeightChange = (event) => {
    setApp(prev => ({
      ...prev,
      controls: {
        ...prev.controls,
        lineHeight: event.target.value
      }
    }))
  };

  const handleUppercaseChange = () => {
    setApp(prev => ({
      ...prev,
      controls: {
        ...prev.controls,
        uppercase: !prev.controls.uppercase
      }
    }))
  };

  const handleAlignment = () => {
    setApp(prev => ({
      ...prev,
      controls: {
        ...prev.controls,
        alignment: prev.controls. alignment === 'left' ? 'center' : 'left'
      }
    }))
  };

  const handleVerticalCenter = () => {
    setApp(prev => ({
      ...prev,
      controls: {
        ...prev.controls,
        verticalCenter: !prev.controls.verticalCenter
      }
    }))
  };

  const handleMouseOverControls = () => {
    setMarkers(prev => ({
        ...prev,
        mouseOverControls: true
    }))
  };

  const handleMouseLeaveControls = () => {
    setMarkers(prev => ({
      ...prev,
        mouseOverControls: false
    }))
  };

  const handleOpentypeFeatureChange = (event) => {
    const updatedTypefaces = typefaces.map(typeface => {
      if (typeface.selected) {
        return {
          ...typeface, 
          fonts: typeface.fonts.map(font => {
            if (font.selected) {
              return {
                ...font,
                opentypeFeatures: font.opentypeFeatures.map(feature => {
                  if (feature.tag === event.target.value) {
                    return {
                      ...feature,
                      selected: !feature.selected
                    }
                  }
                  return feature;
                })
              }
            }
            return font;
          })
        }
      }
      return typeface; 
    });
  
    setTypefaces(updatedTypefaces); 
    updateFontFeatures()
}

  const handleBackground = () => {
    setApp(prev => ({
      ...prev,
      controls: {
        ...prev.controls,
        background: prev.controls.background === 'b&w' ? 'w&b' : prev.controls.background === 'w&b' ? 'img' : 'b&w'
      }
    }))
  }

  const handleChangeText = (text) => {
    setApp(prev => ({
      ...prev,
      texts: {
        ...prev.texts,
        sampleText: text
      }
    }))
  }

  const toggleControls = () => {
    setMarkers(prev => ({
      ...prev,
      showControls: !prev.showControls
    }))
    console.log('TOGGLE CONTROLS', markers.showControls)
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
                value={app.controls.fontSize}
                onChange={handleFontSizeChange}
            />
            </label>
            <span>{app.controls.fontSize}</span>
        </div>
        <div>
            <label>
            <input
                type="range"
                min="-0.1"
                max="0.1"
                step="0.01"
                value={app.controls.letterSpacing}
                onChange={handleLetterSpacingChange}
            />
            </label>
            <span>{Math.floor(app.controls.letterSpacing*100)}</span>
        </div>
        <div>
            <label>
            <input
                type="range"
                min="0.7"
                max="1.7"
                step="0.01"
                value={app.controls.lineHeight}
                onChange={handleLineHeightChange}
            />
            </label>
            <span>{app.controls.lineHeight}</span>
        </div>
      </div>
      <div id="font-toggles">
        <div className="font-toggles-basic">
          <a className="toggle" onClick={handleUppercaseChange}>
            {app.controls.uppercase 
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
            {app.controls.alignment === 'left'
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
            {app.controls.verticalCenter
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
          {app.controls.background === "b&w" && <img src="b&w.png"/>}
          {app.controls.background === "w&b" && <img src="w&b.png"/>}
          {app.controls.background === "img" && <img src="img.png"/>}
        </a>
      </div>
  </>)

  const textSamples = (
    <div id="text-samples">
      <div className="opentype-caption">
        Text samples
      </div>
      <div className="text-samples-list">
            {app.texts.textSamplesDATA.map((ts, i) => {
              return (
                <a key={i} onClick={() => handleChangeText(ts.text)} dangerouslySetInnerHTML={{ __html: ts.name }}/>
            )})}
      </div>
    </div>
  )

  useEffect(() => {  
    // Syncing URL with typefaces[].show
    if (queries.t && queries.f) {
      let updatedTypefaces = typefaces.map(typeface => {
        if (typeface.slug === queries.t) {
          return { ...typeface, selected: true }
        }
        return { ...typeface, selected: false }
      })

      updatedTypefaces.forEach((t, i) => {
        t.fonts.forEach((f, i) => {
          if (f.fontTitle === queries.f) {
            f.selected = true
          } else {
            f.selected = false
          }
        })
      }) 

      setTypefaces(updatedTypefaces);
    }


    console.log('TYPEFACES (from fontTester.js)', typefaces)
  }, [])

  useEffect(() => {
    app.controls.verticalCenter 
      ? 
        setApp(prev => ({
          ...prev,
          controls: {
            ...prev.controls,
            alignment: 'center'
          }
        }))
      :
        setApp(prev => ({
          ...prev,
          controls: {
            ...prev.controls,
            alignment: 'left'
          }
        }))
  }, [app.controls.verticalCenter])

  useEffect(() => {
    // Controls show logic
    width > 576 && document.addEventListener('mousemove', handleMouseMove);
    width > 576 && document.addEventListener('mouseleave', handleMouseLeave);
    width > 576 && document.addEventListener('click', handleMouseMove);

    if (width > 576 && markers.mouseOverControls) {
      setMarkers(prev => ({
        ...prev,
        showControls: true
      }))
      clearTimeout(timerRef.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      width > 576 && document.removeEventListener('click', handleMouseMove);
    }

    function handleMouseMove() {
      setMarkers(prev => ({
        ...prev,
        showControls: true
      }))
      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setMarkers(prev => ({
          ...prev,
          showControls: false
        }))
      }, 750);
    }

    function handleMouseLeave() {
      clearTimeout(timerRef.current);
      setMarkers(prev => ({
        ...prev,
        showControls: false
      }))
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      width > 576 && document.removeEventListener('click', handleMouseMove);
    }
  }, [width, markers.mouseOverControls]);

  useEffect(() => {
    if (app.controls.background === 'b&w') { 
      gsap.to(document.querySelector('.background-colors'), { background: 'white', duration: 1 })
      gsap.to(document.querySelector('#typefield-container'), { color: 'black', duration: 1 })
    }
    else if (app.controls.background === 'w&b') {
      gsap.to(document.querySelector('.background-colors'), { background: 'black', duration: 1 })
      gsap.to(document.querySelector('#typefield-container'), { color: 'white', duration: 1 })
    } 
    else if (app.controls.background === 'img') {
      gsap.to(document.querySelector('.background-colors'), { background: 'transparent', duration: 1 })
    } 
  }, [app.controls.background])

  useEffect(() => {
    updateFontFeatures()

    console.log('TYPEFACES', typefaces)
  }, [typefaces]);

  return (
    <section className="tester">
      {width < 576 &&
        <div className="open-controls">
          <a onClick={toggleControls}>
            <img src="more.png" witdh="24px" height="24px"/>
          </a>
        </div>
      }
        <div 
          className={`controls ${markers.showControls ? `toggleIn` : `toggleOut`}`}
          onMouseEnter={handleMouseOverControls} 
          onMouseLeave={handleMouseLeaveControls}
        >
            <div className="title">
              KTF typesetter V 1.0
            </div>
            <div id="controls-container">
              <div id="font-selectors">
                  <label>
                    <select 
                      className="dropdown" 
                      value={typefaces.find(t => t.selected)?.slug || ''}
                      onChange={handleTypefaceChange}
                    >
                        {typefaces.map((t, id) => (
                            <option key={id} value={t.slug}>{t.title}</option>
                        ))}
                    </select>
                  </label>
                  {markers.showFontsDropdown && 
                    <label>
                      <select 
                        className="dropdown"
                        value={typefaces.find(t => t.selected)?.fonts.find(f => f.selected)?.fontTitle || ''} 
                        onChange={handleFontChange}
                      >
                        {typefaces.find(t => t.selected)?.fonts.map((f, id) => (
                            <option key={id} value={f.fontTitle}>{f.fontTitle.slice(f.fontTitle.indexOf(' ') + 1)}</option>
                        ))}
                      </select>
                    </label>
                  }
            </div>
            {universalControls}
            {<div id="opentype">
                <div className="opentype-caption">
                  Opentype features
                </div>
                <div className="opentype-checkboxes">
                  {typefaces.find(t => t.selected).fonts.find(f => f.selected).opentypeFeatures.map((opf, id) => (
                      <label key={id}>
                        <input 
                          type="checkbox" 
                          className="otf-checkbox" 
                          value={opf.tag} 
                          checked={opf.selected}
                          onChange={handleOpentypeFeatureChange}
                        />
                          <span className="opentype-label"> {opf.tag} {opf.name && opf.name} <br/></span>
                          <span className="checkmark"></span>
                      </label>
                    ))
                  }
                </div>
            </div>}
            {textSamples}
            <div id="spacer"></div>

            <div className="buy-button"> 
              <Buy 
                slug={typefaces.find(t => t.selected)?.slug || ''} 
                buy={typefaces.find(t => t.selected)?.buy} 
                downloadLink={typefaces.find(t => t.selected && !t.buy)?.downloadLink}
              />
              {width < 576 &&
                <a className="close-controls" onClick={toggleControls}>
                  <img src="close.png" witdh="10px" height="10px"/>
                </a> 
              }
            </div>
          </div>      
      </div>

      <div id="typefield-container" style={{
        display: `${app.controls.verticalCenter ? `flex` : `block`}`,
        alignItems: `${app.controls.verticalCenter ? `center` : `initial`}`,
        justifyContent: `${app.controls.verticalCenter ? `center` : `initial`}`,
        minHeight: '90vh',
        width: '100%',
        position: 'absolute',
        zIndex: 1,
        top: 0,
      }}>
        <div 
          id="textfield" 
          style={{
            fontFamily: `${typefaces.find(t => t.selected)?.title || ''} ${typefaces.find(t => t.selected)?.fonts.find(f => f.selected)?.fontTitle.slice(typefaces.find(t => t.selected)?.fonts.find(f => f.selected)?.fontTitle.indexOf(' ') + 1 || 0) || ''}`,
            fontSize: `${app.controls.fontSize}px`,
            letterSpacing: `${app.controls.letterSpacing}em`,
            lineHeight: app.controls.lineHeight,
            textTransform: app.controls.uppercase ? 'uppercase' : 'none',
            textAlign: app.controls.alignment,
            fontFeatureSettings: app.controls.fontFeatureSettings,
          }}
          contentEditable="plaintext-only"
          spellCheck="false"
        >
            {app.texts.sampleText}
        </div>
      </div>

    </section>
  );
}