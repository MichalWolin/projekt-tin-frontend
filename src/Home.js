import React from 'react';
import { useCookies } from 'react-cookie';
import pl from './locales/pl.json';
import en from './locales/en.json';

function Home() {
  const [cookies] = useCookies(['user']);
  const translations = cookies.user && cookies.user.language === 'polish' ? pl : en;

  return (
    <div className="div-align">
      <h2>{translations.main_page}</h2>
      <p>{translations.welcome1}</p>
      <p>{translations.welcome2}</p>
      <p>{translations.welcome3}</p>
    </div>
  );
}

export default Home;