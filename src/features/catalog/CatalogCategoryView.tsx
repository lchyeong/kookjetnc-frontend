import { Link } from 'react-router-dom';

import type { CatalogCategory } from '@/features/catalog/types';
import { routePaths } from '@/routes/routeRegistry';

import styles from './CatalogCategoryView.module.scss';

interface CatalogCategoryViewProps {
  category: CatalogCategory;
}

const CatalogCategoryView = ({ category }: CatalogCategoryViewProps) => {
  return (
    <div className={styles['page']}>
      <section
        className={styles['subVisual']}
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(5, 18, 27, 0.88), rgba(5, 18, 27, 0.52)), url(${category.hero.backgroundImageSrc})`,
        }}
      >
        <div className={styles['subVisualInner']}>
          <p className={styles['subVisualEyebrow']}>{category.hero.eyebrow}</p>
          <h1 className={styles['subVisualTitle']}>{category.hero.subtitle}</h1>
          <p className={styles['subVisualText']}>{category.hero.description}</p>

          <ul className={styles['spotlightList']}>
            {category.hero.spotlight.map((item) => {
              return (
                <li className={styles['spotlightItem']} key={item}>
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className={styles['catalogSection']}>
        <div className={styles['catalogInner']}>
          <div className={styles['listWrap']}>
            <div className={styles['listSection']}>
              <p className={styles['totalText']}>
                총{' '}
                <span
                  className={styles['totalTextStrong']}
                >{`${String(category.cards.length)}개`}</span>{' '}
                상품
              </p>

              <div className={styles['cardGrid']}>
                {category.cards.map((card) => {
                  return (
                    <article className={styles['card']} key={card.id}>
                      <div className={styles['cardThumb']}>
                        <img alt={card.imageAlt} src={card.imageSrc} />
                      </div>

                      <div className={styles['cardBody']}>
                        <h3 className={styles['cardTitle']}>{card.title}</h3>
                        <p className={styles['cardModel']}>{card.model}</p>
                        <p className={styles['cardDescription']}>{card.summary}</p>

                        <ul className={styles['tagList']}>
                          {card.tags.slice(0, 3).map((tag) => {
                            return (
                              <li className={styles['tagItem']} key={tag}>
                                {tag}
                              </li>
                            );
                          })}
                        </ul>

                        <div className={styles['cardActionBox']}>
                          <Link
                            className={styles['cardAction']}
                            to={routePaths.catalogDetail(category.id, card.slug)}
                          >
                            <span>자세히보기</span>
                            <span aria-hidden='true' className={styles['cardActionArrow']}>
                              ›
                            </span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CatalogCategoryView;
