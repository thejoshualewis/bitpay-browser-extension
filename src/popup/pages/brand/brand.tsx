import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './brand.scss';
import { Directory } from '../../../services/directory';
import { Merchant, getDiscount } from '../../../services/merchant';
import { resizeToFitPage, FrameDimensions } from '../../../services/frame';
import { goToPage } from '../../../services/browser';
import CardDenoms from '../../components/card-denoms/card-denoms';
import ActionButton from '../../components/action-button/action-button';
import DiscountText from '../../components/discount-text/discount-text';
import MerchantCell from '../../components/merchant-cell/merchant-cell';

const Brand: React.FC<RouteComponentProps & { directory: Directory; merchants: Merchant[] }> = ({
  location,
  directory,
  merchants
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { merchant } = location.state as { merchant: Merchant };
  const [expandText, setExpandText] = useState(merchant.hasDirectIntegration && merchant.instructions.length < 300);
  const [padding, setPadding] = useState({});
  const cardConfig = merchant.giftCards[0];
  if (cardConfig && !cardConfig.description) cardConfig.description = cardConfig.terms;
  const color = merchant.theme === '#ffffff' ? '#4f6ef7' : merchant.theme;
  const bubbleStyle = { color: { color, borderColor: color }, contents: { transform: 'translateY(-0.5px)' } };
  const suggested = useMemo((): { category: string; suggestions: Merchant[] } => {
    const category = Object.keys(directory.categories).sort(
      (a, b) =>
        directory.categories[b].tags.filter((tag: string) => merchant.tags.includes(tag)).length -
        directory.categories[a].tags.filter((tag: string) => merchant.tags.includes(tag)).length
    )[0];
    const suggestions = merchants
      .filter((m: Merchant) => m.displayName !== merchant.displayName)
      .sort(
        (a: Merchant, b: Merchant) =>
          b.tags.filter((tag: string) => merchant.tags.includes(tag)).length -
          a.tags.filter((tag: string) => merchant.tags.includes(tag)).length
      )
      .slice(0, 8)
      .sort(() => 0.5 - Math.random());
    return { category, suggestions };
  }, [directory, merchants, merchant]);
  useEffect((): void => {
    if (!ref.current) return;
    resizeToFitPage(ref, merchant.cta || merchant.giftCards[0] ? 125 : 50);
    setPadding({
      paddingBottom: ref.current.scrollHeight > FrameDimensions.maxFrameHeight - 125 ? '96px' : 'auto'
    });
  }, [ref, merchant, expandText]);
  return (
    <div className="brand-page">
      <div ref={ref}>
        <div className="brand-page__header">
          <div className="brand-page__header__icon--wrapper">
            <img className="brand-page__header__icon" alt={merchant.displayName} src={merchant.icon} />
            <button
              className="brand-page__header__icon--hover"
              onClick={(): void => goToPage(merchant.link)}
              type="button"
            >
              <img alt="go to website" src="../assets/icons/link-icon.svg" />
            </button>
          </div>
          <div className="brand-page__header__block">
            <div className="brand-page__header__block__title">{merchant.displayName}</div>
            <div className="brand-page__header__block__caption">
              {merchant.hasDirectIntegration ? <>{merchant.caption}</> : <CardDenoms cardConfig={cardConfig} />}
            </div>
            {getDiscount(merchant) && (
              <div className="brand-page__header__block__discount" style={bubbleStyle.color}>
                <div style={bubbleStyle.contents}>
                  <DiscountText merchant={merchant} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="brand-page__body" style={padding}>
          <div className="brand-page__body__divider" style={{ marginTop: '2px' }} />
          <div className="brand-page__body__content">
            <div className="brand-page__body__content__title">
              {merchant.hasDirectIntegration ? <>Payment Instructions</> : <>About</>}
            </div>
            <div
              className={`brand-page__body__content__text${
                expandText ? ' brand-page__body__content__text--expand' : ''
              }`}
            >
              {merchant.hasDirectIntegration ? (
                <>{merchant.instructions}</>
              ) : (
                <>
                  <ReactMarkdown source={cardConfig.description} linkTarget="_blank" />
                </>
              )}
              {!expandText && (
                <button
                  type="button"
                  onClick={(): void => setExpandText(true)}
                  className="brand-page__body__content__text--action"
                >
                  more
                </button>
              )}
            </div>
          </div>
          {expandText && cardConfig && cardConfig.terms && (
            <>
              <div className="brand-page__body__divider" />
              <div className="brand-page__body__content">
                <div className="brand-page__body__content__title">Terms & Conditions</div>
                <div className="brand-page__body__content__text brand-page__body__content__text--expand">
                  <ReactMarkdown source={cardConfig.terms} linkTarget="_blank" />
                </div>
              </div>
            </>
          )}
          {merchant.hasDirectIntegration && !merchant.cta && (
            <>
              <div className="brand-page__body__divider" />
              <div className="shop-page__section-header">
                You Might Also Like
                {suggested.category && (
                  <Link
                    className="shop-page__section-header--action"
                    to={{
                      pathname: `/category/${directory.categories[suggested.category].displayName}`,
                      state: { category: directory.categories[suggested.category] }
                    }}
                  >
                    See All
                  </Link>
                )}
              </div>
              {suggested.suggestions.length > 0 && (
                <>
                  {suggested.suggestions.slice(0, 2).map(suggestion => (
                    <Link
                      to={{
                        pathname: `/brand/${suggestion.name}`,
                        state: { merchant: suggestion }
                      }}
                      key={suggestion.name}
                    >
                      <MerchantCell key={suggestion.name} merchant={suggestion} />
                    </Link>
                  ))}
                </>
              )}
            </>
          )}
        </div>
        {(merchant.cta || cardConfig) && (
          <div className="action-button__footer--fixed">
            {merchant.hasDirectIntegration && merchant.cta ? (
              <ActionButton onClick={(): void => merchant.cta && goToPage(merchant.cta.link)}>
                {merchant.cta.displayText}
              </ActionButton>
            ) : (
              <Link to={{ pathname: `/amount/${cardConfig.name}`, state: { cardConfig, merchant } }}>
                <ActionButton>Buy Credits</ActionButton>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Brand;
