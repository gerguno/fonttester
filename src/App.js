import './fonts.css'
import './fontTester.scss'
import FontTester from './fontTester';
import React, { Fragment, useEffect, useState } from "react";
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { request } from 'graphql-request';
import opentype from 'opentype.js'
import Base64Binary from "./base64-binary";

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [typefaces, setTypefaces] = useState(null)

  // Fetch images 
  // https://jackskylord.medium.com/how-to-preload-images-into-cache-in-react-js-ff1642708240
  const cacheImages = async (srcArray) => {
    const promises = await srcArray.map((src) => {
      return new Promise(function (resolve, reject) {
        const img = new Image()

        img.src = src
        img.onload = resolve()
        img.onerror = reject()
      })
    })
    await Promise.all(promises)
    setIsLoading(false)
  }

  useEffect(() => {
    // Cache images
    const imgs = [
      'kvas-people.jpg'
    ]
    cacheImages(imgs)

    // Fetch fonts
    const fetchFonts = async () => {
      const { typefaces } = await request(
        'https://api-eu-central-1.graphcms.com/v2/ckipww3t7jgqt01z11xzlhmwi/master',
        `
        {
          typefaces {
            title
            slug
            fonts {
              fontTitle
              base64
            }
          }
        }
    `
      );

    // Load fonts to a document
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
              if (/^\d+$/.test(key) && parseInt(key) > 255) {
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
      setTypefaces(typefaces);
    }
    fetchFonts();
  }, [])

  return (
    <div className='App'>
      {isLoading || !typefaces
        ? 
          <div class="lds-circle"><div></div></div>
        :
          <Fragment>
            <div className='main-page-content'>
              <FontTester typefaces={typefaces}/>
            </div>
          </Fragment>
      }
    </div>
    
  );
}

export default App;
