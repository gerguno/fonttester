import './style/fonts.css';
import './style/fontTester.scss';
import FontTester from './components/fontTester';
import React, { Fragment, useEffect, useState } from "react";
import { request } from 'graphql-request';
import opentype from 'opentype.js';
import Base64Binary from "./utils/base64-binary";
import { customTypefaces } from './data/customTypefaces';
import { type } from '@testing-library/user-event/dist/type';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [typefaces, setTypefaces] = useState(null);

  // Fetch images 
  // https://jackskylord.medium.com/how-to-preload-images-into-cache-in-react-js-ff1642708240
  const cacheImages = async (srcArray) => {
    const promises = await srcArray.map((src) => {
      return new Promise(function (resolve, reject) {
        const img = new Image();

        img.src = src;
        img.onload = resolve();
        img.onerror = reject();
      });
    });
    await Promise.all(promises);
    setIsLoading(false);
  };

  useEffect(() => {
    // Cache images
    const imgs = [
      'kvas-people.jpg'
    ];
    cacheImages(imgs);

    // Fetch fonts
    const fetchFonts = async () => {
      let { typefaces } = await request(
        'https://api-eu-central-1.graphcms.com/v2/ckipww3t7jgqt01z11xzlhmwi/master',
        `
        {
          typefaces(orderBy: id_DESC) {
            title
            slug
            buy
            fonts {
              fontTitle
              base64
            }
          }
        }
        `
      );

      // Add custom typefaces
      typefaces = [...customTypefaces, ...typefaces];

      // Load fonts to a document
      typefaces.map((t) => {
        t.fonts.map((f, i) => {
          const fontFace = new FontFace(`${t.title} ${f.fontTitle.slice(f.fontTitle.indexOf(' ') + 1)}`, `url(data:application/octet-stream;base64,${f.base64})`);
          document.fonts.add(fontFace);
        });
      });

      // Add font features data from base64s to typefaces array 
      // Base64 Must be of WOFF, not WOFF2
      // Use this https://www.giftofspeed.com/base64-encoder

      async function analyzeFonts(typeface) {
        const fontAnalysisPromises = typeface.fonts.map(async (f, i) => {
          const font = await opentype.parse(Base64Binary.decodeArrayBuffer(f.base64));
          const features = [...new Set(font.tables.gsub.features.map((f) => f.tag))].map(tag => ({ tag }));

          // console.log('FONT', font);
          // console.log('FEATURES', features);

          let fontNames = [];
          if (font.names.hasOwnProperty('256')) {
            for (let key in font.names) {
              if (/^\d+$/.test(key) && parseInt(key) > 255) {
                for (let n in font.names[key]) {
                  fontNames.push(font.names[key][n]);
                }
              }
            }
          }

          let counter = 0;
          features.forEach((feature) => {
            feature.selected = false;
            
            if (feature.tag.includes('ss')) {
              feature.name = fontNames[counter++];
            }
          });

          f.opentypeFeatures = features;
          f.selected = false;
        });

        await Promise.all(fontAnalysisPromises);
      }

      async function analyzeTypefaces(typefaces) {
        for (let i = 0; i < typefaces.length; i++) {
          try {
            await analyzeFonts(typefaces[i]);
          } catch (error) {
            console.error(`Error analyzing typeface at index ${i}:`, error);
          }
        }
      }

      analyzeTypefaces(typefaces).then(() => {
        console.log('Typefaces analyzed.');
        typefaces.forEach((typeface, i) => {
          if (i === 0) {
            typeface.selected = true;
            typeface.fonts[0].selected = true;
          } else {
            typeface.selected = false;
          } 
          
        });

        // Finally, set the state
        setTypefaces(typefaces);
        console.log('TYPEFACES (from App):', typefaces);
      });
    };

    fetchFonts();
  }, []);


  return (
    <div className='App'>
      {isLoading || !typefaces
        ? 
          <div className="lds-circle"><div></div></div>
        :
          <div className='main-page-content'>
            <FontTester source={typefaces}/>
          </div>
      }
    </div>
    
  );
}

export default App;
