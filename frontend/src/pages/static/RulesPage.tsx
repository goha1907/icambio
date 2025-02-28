import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { PageTitle } from '@/shared/ui/PageTitle';

export const RulesPage = () => {
  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <PageTitle
          title="Правила обмена"
          description="Ознакомьтесь с правилами обмена валют в iCambio"
        />

        <Card>
          <CardContent className="prose max-w-none">
            <p className="text-gray-600">Здесь будут размещены правила обмена валют.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
