// frontend/src/pages/static/AMLKYCPage.tsx
import { Card, CardContent } from '@/shared/ui/Card';
import { PageTitle } from '@/shared/ui/PageTitle';

export const AMLKYCPage = () => {
  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <PageTitle
          title="AML/KYC"
          description="Политика противодействия отмыванию денег и процедура идентификации клиентов"
        />

        <Card>
          <CardContent className="prose max-w-none">
            <p className="text-gray-600">Здесь будет размещена информация о политике AML/KYC.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
