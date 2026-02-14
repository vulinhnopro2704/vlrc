import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-card py-12 dark:bg-card/40 dark:backdrop-blur-md dark:border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 text-2xl font-bold text-primary">VLRC</div>
            <p className="text-muted-foreground">{t('footer_description')}</p>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold text-foreground">{t('product')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">{t('features')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('pricing')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold text-foreground">{t('resources')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">{t('blog')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('guides')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold text-foreground">{t('company')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">{t('about')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('contact')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center text-muted-foreground dark:border-white/10">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
