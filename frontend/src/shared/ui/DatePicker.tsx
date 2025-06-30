import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface DatePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

/**
 * Компонент DatePicker для выбора диапазона дат
 * 
 * Поддерживает выбор диапазона дат в стиле авиакомпаний - 
 * клик на первую дату, затем на вторую для выбора диапазона.
 * 
 * @example
 * <DatePicker 
 *   value={dateRange}
 *   onChange={setDateRange}
 *   placeholder="Выберите период"
 * />
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Выберите диапазон дат",
  className,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempRange, setTempRange] = useState<DateRange>({ from: null, to: null });
  const containerRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setTempRange({ from: null, to: null });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Получение дней месяца
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Получаем день недели для первого дня (0 = воскресенье, нужно конвертировать)
    const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Конвертируем в понедельник = 0
    
    const days = [];
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Добавляем дни текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Проверка, находится ли дата в выбранном диапазоне
  const isInRange = (date: Date) => {
    if (!value?.from || !value?.to) return false;
    return date >= value.from && date <= value.to;
  };

  // Проверка, является ли дата началом или концом диапазона
  const isRangeStart = (date: Date) => {
    return value?.from && date.toDateString() === value.from.toDateString();
  };

  const isRangeEnd = (date: Date) => {
    return value?.to && date.toDateString() === value.to.toDateString();
  };

  // Обработка клика по дате
  const handleDateClick = (date: Date) => {
    if (disabled) return;

    if (!tempRange.from || (tempRange.from && tempRange.to)) {
      // Начинаем новый выбор
      setTempRange({ from: date, to: null });
    } else {
      // Завершаем выбор диапазона
      const newRange = tempRange.from <= date 
        ? { from: tempRange.from, to: date }
        : { from: date, to: tempRange.from };
      
      onChange?.(newRange);
      setTempRange({ from: null, to: null });
      setIsOpen(false);
    }
  };

  // Очистка выбранного диапазона
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.({ from: null, to: null });
    setTempRange({ from: null, to: null });
  };

  // Навигация по месяцам
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  // Форматирование отображаемого значения
  const formatDisplayValue = () => {
    if (!value?.from && !value?.to) return placeholder;
    
    const formatDate = (date: Date) => date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    if (value.from && value.to) {
      return `${formatDate(value.from)} - ${formatDate(value.to)}`;
    } else if (value.from) {
      return `${formatDate(value.from)} - ...`;
    }
    
    return placeholder;
  };

  const days = getDaysInMonth(currentMonth);
  const hasValue = value?.from || value?.to;

  return (
    <div ref={containerRef} className="relative">
      {/* Поле ввода */}
      <div
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer',
          'ring-offset-background placeholder:text-muted-foreground',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={cn(
          'flex-1',
          (!value?.from && !value?.to) && 'text-muted-foreground'
        )}>
          {formatDisplayValue()}
        </span>
        <div className="flex items-center gap-1">
          {hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-accent rounded-sm"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <Calendar className="h-4 w-4 opacity-50" />
        </div>
      </div>

      {/* Календарь */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-80 rounded-md border bg-popover p-4 shadow-md">
          {/* Заголовок с навигацией */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-accent rounded-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <h3 className="font-semibold">
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-accent rounded-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Дни недели */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Календарная сетка */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => (
              <div key={index} className="aspect-square">
                {date && (
                  <button
                    type="button"
                    onClick={() => handleDateClick(date)}
                    className={cn(
                      'w-full h-full rounded-sm text-sm hover:bg-accent hover:text-accent-foreground',
                      'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                      // Стили для выбранного диапазона
                      isInRange(date) && 'bg-primary/10',
                      (isRangeStart(date) || isRangeEnd(date)) && 'bg-primary text-primary-foreground',
                      // Временный выбор
                      tempRange.from && date.toDateString() === tempRange.from.toDateString() && 'bg-primary text-primary-foreground',
                      // Сегодняшний день
                      date.toDateString() === new Date().toDateString() && 'font-bold'
                    )}
                  >
                    {date.getDate()}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Подсказка и кнопка очистки */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {!tempRange.from ? 'Выберите начальную дату' : 'Выберите конечную дату'}
            </div>
            {hasValue && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Очистить
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 