import { Link } from 'react-router-dom';
import { Logo } from '@/shared/ui/Logo';
import { Phone, Mail, MessageCircle, Clock, MapPin, Shield } from 'lucide-react';

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
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Лицензия ЦБ РФ</span>
            </div>
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
                  Обменник
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
                  to="/working-hours" 
                  className="text-sm text-gray-600 hover:text-icmop-primary transition-colors duration-200"
                >
                  График работы
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
                  to="/privacy" 
                  className="text-sm text-gray-600 hover:text-icmop-primary transition-colors duration-200"
                >
                  Политика конфиденциальности
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
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a 
                  href="tel:+79991234567" 
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
              
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a 
                  href="mailto:info@icambio.com" 
                  className="text-sm text-gray-600 hover:text-icmop-primary transition-colors duration-200"
                >
                  info@icambio.com
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
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © {currentYear} iCambio. Все права защищены.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <Link 
                to="/terms" 
                className="hover:text-icmop-primary transition-colors duration-200"
              >
                Пользовательское соглашение
              </Link>
              <Link 
                to="/privacy" 
                className="hover:text-icmop-primary transition-colors duration-200"
              >
                Конфиденциальность
              </Link>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>SSL защита</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
