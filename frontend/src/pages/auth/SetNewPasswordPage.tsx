import { SetNewPasswordForm } from '@/features/auth/components/SetNewPasswordForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { PageTitle } from '@/shared/ui/PageTitle';

export function SetNewPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <PageTitle
        title="Установка нового пароля"
        description="Введите и подтвердите ваш новый пароль."
      />
      <Card className="w-full max-w-md bg-white shadow-lg rounded-xl mt-8">
        <CardHeader>
          <CardTitle>Установка нового пароля</CardTitle>
        </CardHeader>
        <CardContent>
          <SetNewPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
} 