import React, { useState, useEffect } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom';
import Brand from './pages/brand/brand';
import Card from './pages/card/card';
import Cards from './pages/cards/cards';
import Wallet from './pages/wallet/wallet';
import Settings from './pages/settings/settings';
import Shop from './pages/shop/shop';
import './styles.scss';
import Tabs from './components/tabs/tabs';
import Navbar from './components/navbar/navbar';
import { isBitPayAccepted } from '../services/merchant';
import { CardConfig } from '../services/gift-card.types';

console.log('parent', window.location);

const Popup: React.FC = () => {
  const [initialEntries, setInitialEntries] = useState(['/shop']);
  const [loaded, setLoaded] = useState(false);
  const [merchants, setMerchants] = useState([] as CardConfig[]);

  useEffect(() => {
    const getStartPage = async (): Promise<void> => {
      console.log('getStartPage');
      const { availableGiftCards } = (await browser.storage.local.get('availableGiftCards')) as {
        availableGiftCards: CardConfig[];
      };
      const parent = new URLSearchParams(window.location.search).get('url') as string;
      const { host } = new URL(parent);
      const initialPath = isBitPayAccepted(host, availableGiftCards) ? '/wallet' : '/shop';
      setInitialEntries([initialPath]);
      setMerchants(availableGiftCards);
      setLoaded(true);
    };
    getStartPage();
  }, []);
  return (
    <div>
      {loaded ? (
        <Router initialEntries={initialEntries}>
          <Navbar />
          <Switch>
            <Route path="/brand/:brand" component={Brand} />
            <Route path="/cards/:brand" component={Cards} />
            <Route path="/card/:id" component={Card} />
            <Route path="/wallet" component={Wallet} />
            <Route path="/shop" render={(props): JSX.Element => <Shop merchants={merchants} {...props} />} />
            <Route path="/settings" component={Settings} />
          </Switch>
          <Tabs />
        </Router>
      ) : null}
    </div>
  );
};

export default Popup;