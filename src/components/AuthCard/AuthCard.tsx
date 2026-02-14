import { Card } from '@/components/ui/card';

const AuthCard = ({
  children,
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}) => {
  return (
    <Card ref={ref} variant='auth' className={className} {...props}>
      <div className='p-8 md:p-10'>{children}</div>
    </Card>
  );
};

export default AuthCard;
