import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-card py-12 dark:bg-card/40 dark:backdrop-blur-md dark:border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 text-2xl font-bold text-primary">VLRC</div>
            <p className="text-muted-foreground">{t('footer.description')}</p>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">{t('footer.product')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.features')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.pricing')}</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">{t('footer.resources')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.blog')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.guides')}</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">{t('footer.company')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.about')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.contact')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center text-muted-foreground dark:border-white/10">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
