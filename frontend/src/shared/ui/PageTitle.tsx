import * as React from 'react';
import { cn } from '@/lib/utils';

interface PageTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children?: React.ReactNode; // Для дополнительных элементов (кнопки, ссылки)
}

const PageTitle = React.forwardRef<HTMLDivElement, PageTitleProps>(
  ({ title, description, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mb-8', className)} {...props}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="mt-2 text-sm text-icmop-primary">
                {description}
              </p>
            )}
          </div>
          {children && (
            <div className="flex items-center space-x-4">{children}</div>
          )}
        </div>
      </div>
    );
  },
);

PageTitle.displayName = 'PageTitle';

export { PageTitle };
