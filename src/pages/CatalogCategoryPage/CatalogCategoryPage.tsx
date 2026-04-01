import CatalogCategoryView from '@/features/catalog/CatalogCategoryView';
import { getCatalogCategory } from '@/features/catalog/data';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import type { CatalogCategorySlug } from '@/routes/routeRegistry';

interface CatalogCategoryPageProps {
  categorySlug: CatalogCategorySlug;
}

const CatalogCategoryPage = ({ categorySlug }: CatalogCategoryPageProps) => {
  const category = getCatalogCategory(categorySlug);

  if (!category) {
    return <NotFoundPage />;
  }

  return <CatalogCategoryView category={category} key={category.id} />;
};

export default CatalogCategoryPage;
