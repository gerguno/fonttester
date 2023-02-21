import React, { useEffect, useState, useRef } from "react";
import typefacesJSON from './typefaces.json'
import './fontTester.css'
import opentype from 'opentype.js'
import Base64Binary from "./base64-binary";

let typefaces = [...typefacesJSON.data.typefaces]

// Load fonts
typefaces.map((t) => {
  t.fonts.map((f, i) => {
      const fontFace = new FontFace(`${t.title} ${f.fontTitle.slice(f.fontTitle.indexOf(' ') + 1)}`, `url(data:application/octet-stream;base64,${f.base64})`);
      document.fonts.add(fontFace);
  })
})

export default function FontTester() {
  const [typeface, setTypeface] = useState(typefaces[0]);
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
  const timerRef = useRef(null);

  const handleTypefaceChange = (event) => {
    const foundT = typefaces.find(foundT => foundT.title === event.target.value);
    setTypeface(foundT);
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

  const textStyle = {
    fontFamily: `${typeface.title} ${style}`,
    fontSize: `${fontSize}px`,
    letterSpacing: `${letterSpacing}em`,
    lineHeight: lineHeight,
    textTransform: `${uppercase ? `uppercase` : `none`}`,
    textAlign: `${alignment}`
  }

  useEffect(() => {
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
      }

      parse()
    }

    console.log(typefaces)
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
  }, [mouseOverControls]);

  return (
    <div>
        <div id="controls"
            onMouseEnter={handleMouseOverControls} 
            onMouseLeave={handleMouseLeaveControls}
            style={{
            display: `${showControls ? `block` : `none`}`,
            width: '360px',
            height: '360px',
            borderRadius: '4px',
            backgroundColor: 'rgba(217, 217, 217, 0.95)',
            backdropFilter: 'blur(60px)',
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            padding: '16px',
        }}>
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
      </div>
      <div style={{
        display: `${verticalCenter ? `flex` : `block`}`,
        alignItems: `${verticalCenter ? `center` : `initial`}`,
        justifyContent: `${verticalCenter ? `center` : `initial`}`,
        minHeight: '90vh'
      }}>
        <div id="textfield" style={textStyle} contenteditable="plaintext-only">
            The quick brown fox jumps over the lazy dog. The quick brown fox jumps
            over the lazy dog. The quick brown fox jumps over the lazy dog.
        </div>
      </div>
    </div>
  );
}