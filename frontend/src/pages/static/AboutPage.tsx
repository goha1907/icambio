import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { PageTitle } from '@/shared/ui/PageTitle';

export const AboutPage = () => {
  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <PageTitle title="О нас" description="Узнайте больше о компании iCambio" />

        <Card>
          <CardContent className="prose max-w-none">
            <p className="text-gray-600">Здесь будет размещена информация о компании iCambio.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
