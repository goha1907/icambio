interface PageTitleProps {
  title: string;
  description?: string;
  children?: React.ReactNode; // Для дополнительных элементов (кнопки, ссылки)
}

export const PageTitle = ({ title, description, children }: PageTitleProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
        </div>
        {children && <div className="flex items-center space-x-4">{children}</div>}
      </div>
    </div>
  );
};
