import { useParams } from 'react-router-dom';

import CatalogDetailView from '@/features/catalog/CatalogDetailView';
import { getCatalogEntry } from '@/features/catalog/data';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';

const CatalogDetailPage = () => {
  const params = useParams();
  const categorySlug = params['categorySlug'];
  const itemSlug = params['itemSlug'];

  if (!categorySlug || !itemSlug) {
    return <NotFoundPage />;
  }

  const entry = getCatalogEntry(categorySlug, itemSlug);

  if (!entry) {
    return <NotFoundPage />;
  }

  return <CatalogDetailView card={entry.card} category={entry.category} />;
};

export default CatalogDetailPage;
