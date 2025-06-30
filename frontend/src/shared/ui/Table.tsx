import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Варианты стилей для основной таблицы
 * Определяет различные размеры и стили отображения
 */
const tableVariants = cva(
  // Базовые стили - общие для всех вариантов
  'w-full caption-bottom text-sm border-collapse',
  {
    variants: {
      /**
       * Размеры таблицы
       * - sm: компактная таблица для плотного размещения данных
       * - md: стандартная таблица (по умолчанию)
       * - lg: просторная таблица для важных данных
       */
      size: {
        sm: 'text-xs [&_th]:h-8 [&_th]:px-2 [&_td]:p-2',
        md: 'text-sm [&_th]:h-12 [&_th]:px-4 [&_td]:p-4',
        lg: 'text-base [&_th]:h-16 [&_th]:px-6 [&_td]:p-6',
      },
      /**
       * Варианты стилизации
       * - default: стандартная таблица с границами
       * - striped: полосатая таблица с чередующимися цветами строк
       * - bordered: таблица с видимыми границами всех ячеек
       */
      variant: {
        default: '',
        striped: '[&_tbody_tr:nth-child(even)]:bg-muted/30',
        bordered: 'border [&_th]:border [&_td]:border',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

/**
 * Интерфейс пропсов для основной таблицы
 */
interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  /** Размер таблицы */
  size?: 'sm' | 'md' | 'lg';
  /** Вариант стилизации */
  variant?: 'default' | 'striped' | 'bordered';
}

/**
 * Основной компонент Table - контейнер для табличных данных
 * 
 * Предоставляет структурированное отображение данных в виде таблицы
 * с поддержкой различных размеров и стилей оформления.
 * 
 * @example
 * // Базовое использование
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Название</TableHead>
 *       <TableHead>Значение</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>Данные 1</TableCell>
 *       <TableCell>Значение 1</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * 
 * @example
 * // Полосатая таблица большого размера
 * <Table size="lg" variant="striped">
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Валюта</TableHead>
 *       <TableHead>Курс</TableHead>
 *     </TableRow>
 *   </TableHeader>
 * </Table>
 */
const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, size, variant, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn(tableVariants({ size, variant }), className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

/**
 * Интерфейс пропсов для TableHeader
 */
interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Закрепить заголовок при прокрутке */
  sticky?: boolean;
  /** Показать строку с фильтрами */
  showFilters?: boolean;
  /** Компонент с фильтрами */
  filtersComponent?: React.ReactNode;
}

/**
 * Компонент TableHeader - заголовочная секция таблицы
 * 
 * Содержит строки с заголовками колонок. Может быть закреплен
 * в верхней части при прокрутке длинных таблиц.
 * Поддерживает интегрированные фильтры.
 * 
 * @example
 * <TableHeader>
 *   <TableRow>
 *     <TableHead>Колонка 1</TableHead>
 *     <TableHead>Колонка 2</TableHead>
 *   </TableRow>
 * </TableHeader>
 * 
 * @example
 * // С фильтрами
 * <TableHeader 
 *   showFilters 
 *   filtersComponent={<MyFiltersComponent />}
 * >
 *   <TableRow>
 *     <TableHead>Закрепленный заголовок</TableHead>
 *   </TableRow>
 * </TableHeader>
 */
const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, sticky, showFilters, filtersComponent, children, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(
        '[&_tr]:border-b',
        sticky && 'sticky top-0 z-10 bg-background',
        className
      )}
      {...props}
    >
      {showFilters && filtersComponent && (
        <tr className="border-b bg-gray-50">
          <td colSpan={100} className="p-0">
            {filtersComponent}
          </td>
        </tr>
      )}
      {children}
    </thead>
  )
);
TableHeader.displayName = 'TableHeader';

/**
 * Компонент TableBody - основная секция с данными таблицы
 * 
 * Содержит строки с данными. Поддерживает различные состояния строк
 * и интерактивные элементы.
 * 
 * @example
 * <TableBody>
 *   <TableRow>
 *     <TableCell>Данные</TableCell>
 *     <TableCell>Значения</TableCell>
 *   </TableRow>
 * </TableBody>
 */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

/**
 * Компонент TableFooter - нижняя секция таблицы
 * 
 * Используется для отображения итоговых данных, сумм,
 * пагинации или других заключительных элементов.
 * 
 * @example
 * <TableFooter>
 *   <TableRow>
 *     <TableCell>Итого:</TableCell>
 *     <TableCell>1000 USD</TableCell>
 *   </TableRow>
 * </TableFooter>
 */
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

/**
 * Интерфейс пропсов для TableRow
 */
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Строка выделена/выбрана */
  selected?: boolean;
  /** Строка отключена */
  disabled?: boolean;
  /** Строка кликабельна */
  clickable?: boolean;
}

/**
 * Компонент TableRow - строка таблицы
 * 
 * Представляет одну строку данных в таблице. Поддерживает различные
 * состояния: выделение, отключение, интерактивность.
 * 
 * @example
 * <TableRow>
 *   <TableCell>Обычная строка</TableCell>
 * </TableRow>
 * 
 * @example
 * // Выделенная кликабельная строка
 * <TableRow selected clickable onClick={() => console.log('Clicked')}>
 *   <TableCell>Интерактивная строка</TableCell>
 * </TableRow>
 */
const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, disabled, clickable, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b transition-colors',
        // Состояния строки
        !disabled && 'hover:bg-muted/50',
        selected && 'bg-muted data-[state=selected]:bg-muted',
        disabled && 'opacity-50 cursor-not-allowed',
        clickable && !disabled && 'cursor-pointer hover:bg-muted/70',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

/**
 * Интерфейс пропсов для TableHead
 */
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Колонка поддерживает сортировку */
  sortable?: boolean;
  /** Текущее направление сортировки */
  sortDirection?: 'asc' | 'desc' | null;
  /** Колбэк при клике на сортируемый заголовок */
  onSort?: () => void;
  /** Компонент фильтра для этой колонки */
  filterComponent?: React.ReactNode;
}

/**
 * Компонент TableHead - заголовок колонки таблицы
 * 
 * Отображает заголовок колонки с возможностью сортировки и фильтрации.
 * Поддерживает индикаторы направления сортировки и встроенные фильтры.
 * 
 * @example
 * <TableHead>Простой заголовок</TableHead>
 * 
 * @example
 * // Сортируемый заголовок
 * <TableHead 
 *   sortable 
 *   sortDirection="asc"
 *   onSort={() => handleSort('name')}
 * >
 *   Название
 * </TableHead>
 * 
 * @example
 * // Заголовок с фильтром
 * <TableHead 
 *   filterComponent={
 *     <Select onValueChange={handleFilter}>
 *       <SelectItem value="all">Все</SelectItem>
 *       <SelectItem value="active">Активные</SelectItem>
 *     </Select>
 *   }
 * >
 *   Статус
 * </TableHead>
 */
const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, sortable, sortDirection, onSort, filterComponent, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'px-4 text-left align-top font-medium text-icmop-primary [&:has([role=checkbox])]:pr-0',
        'h-auto py-3', // Единая высота для всех заголовков
        sortable && 'cursor-pointer select-none hover:bg-muted/50',
        className
      )}
      onClick={sortable && !filterComponent ? onSort : undefined}
      {...props}
    >
      <div className="space-y-2">
        {/* Заголовок с сортировкой */}
        <div 
          className={cn(
            "flex items-center gap-2 min-h-[1.5rem]", // Минимальная высота для выравнивания
            sortable && filterComponent && "cursor-pointer select-none hover:bg-muted/50 rounded px-1 -mx-1"
          )}
          onClick={sortable && filterComponent ? onSort : undefined}
        >
          {children}
          {/* Индикатор сортировки */}
          {sortable && (
            <div className="flex flex-col">
              <ChevronUp
                className={cn(
                  'h-3 w-3 transition-colors',
                  sortDirection === 'asc' ? 'text-icmop-primary' : 'text-muted-foreground/50'
                )}
              />
              <ChevronDown
                className={cn(
                  'h-3 w-3 -mt-1 transition-colors',
                  sortDirection === 'desc' ? 'text-icmop-primary' : 'text-muted-foreground/50'
                )}
              />
            </div>
          )}
        </div>
        
        {/* Фильтр или пустое место для выравнивания */}
        <div className="w-full min-h-[2.5rem] flex items-center">
          {filterComponent || <div className="h-10"></div>}
        </div>
      </div>
    </th>
  )
);
TableHead.displayName = 'TableHead';

/**
 * Интерфейс пропсов для TableCell
 */
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Выравнивание содержимого ячейки */
  align?: 'left' | 'center' | 'right';
  /** Ячейка содержит числовые данные */
  numeric?: boolean;
}

/**
 * Компонент TableCell - ячейка данных таблицы
 * 
 * Отображает данные в ячейке таблицы с поддержкой различных
 * типов выравнивания и форматирования.
 * 
 * @example
 * <TableCell>Обычные данные</TableCell>
 * 
 * @example
 * // Числовые данные с выравниванием по правому краю
 * <TableCell align="right" numeric>
 *   1,234.56
 * </TableCell>
 */
const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align = 'left', numeric, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        // Выравнивание содержимого
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        // Стили для числовых данных
        numeric && 'font-mono tabular-nums',
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';

/**
 * Компонент TableCaption - подпись к таблице
 * 
 * Предоставляет описание или дополнительную информацию о таблице.
 * Важен для accessibility и понимания контекста данных.
 * 
 * @example
 * <Table>
 *   <TableCaption>
 *     Курсы валют на {new Date().toLocaleDateString()}
 *   </TableCaption>
 *   <TableHeader>...</TableHeader>
 * </Table>
 */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  type TableProps,
  type TableHeaderProps,
  type TableRowProps,
  type TableHeadProps,
  type TableCellProps,
};
