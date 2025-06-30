import { Link } from 'react-router-dom';
import { Logo } from '@/shared/ui/Logo';
import { Phone, Mail, MessageCircle, Clock, Shield } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-gray-50">
      {/* Основной контент футера */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Логотип и описание */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Надежный сервис обмена валют с выгодными курсами и быстрой обработкой заявок. 
              Работаем с 2019 года.
            </p>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Навигация
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-sm text-gray-600 hover:text-icmop-primary transition-colors duration-200"
                >
                  Главная
                </Link>
              </li>
              <li>
                <Link 
                  to="/exchange" 
                  className="text-sm text-gray-600 hover:text-icmop-primary transition-colors duration-200"
                >
                  Заказать обмен
                </Link>
              </li>
              <li>
                <Link 
                  to="/rates" 
                  className="text-sm text-gray-600 hover:text-icmop-primary transition-colors duration-200"
                >
                  Курсы
                </Link>
              </li>
              <li>
                <Link 
                  to="/reviews" 
                  className="text-sm text-gray-600 hover:text-icmop-primary transition-colors duration-200"
                >
                  Отзывы
                </Link>
              </li>
            </ul>
          </div>

          {/* Информация */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Информация
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/delivery" 
                  className="text-sm text-gray-600 hover:text-icmop-primary transition-colors duration-200"
                >
                  Доставка
                </Link>
              </li>
              <li>
                <Link 
                  to="/rules" 
                  className="text-sm text-gray-600 hover:text-icmop-primary transition-colors duration-200"
                >
                  Правила обмена
                </Link>
              </li>
              <li>
                <Link 
                  to="/working-hours" 
                  className="text-sm text-gray-600 hover:text-icmop-primary transition-colors duration-200"
                >
                  График работы
                </Link>
              </li>
              <li>
                <Link 
                  to="/aml-kyc" 
                  className="text-sm text-gray-600 hover:text-icmop-primary transition-colors duration-200"
                >
                  AML/KYC
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-sm text-gray-600 hover:text-icmop-primary transition-colors duration-200"
                >
                  О нас
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты и график работы */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Контакты
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a 
                  href="mailto:info@icambio.com" 
                  className="text-sm text-gray-600 hover:text-icmop-primary transition-colors duration-200"
                >
                  info@icambio.com
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
                </svg>
                <a 
                  href="https://wa.me/79991234567" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-icmop-primary transition-colors duration-200"
                >
                  +7 999 123-45-67
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a 
                  href="https://t.me/icambio_support" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-icmop-primary transition-colors duration-200"
                >
                  @icambio_support
                </a>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <div>Пн-Пт: 9:00-17:00</div>
                    <div>Сб: 9:00-15:00</div>
                    <div>Вс: выходной</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Нижняя часть с копирайтом */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
          <div className="text-center text-sm text-gray-500">
            © {currentYear} iCambio. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
};
