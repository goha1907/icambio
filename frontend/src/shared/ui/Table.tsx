import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

/**
 * Контекст для передачи пропсов таблицы дочерним элементам
 */
interface TableContextProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'striped' | 'bordered';
}

const TableContext = React.createContext<TableContextProps>({
  size: 'md',
  variant: 'default',
});

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
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
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
        bordered: 'border',
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
    VariantProps<typeof tableVariants> {}

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
      <TableContext.Provider value={{ size: size ?? 'md', variant: variant ?? 'default' }}>
      <table
        ref={ref}
        className={cn(tableVariants({ size, variant }), className)}
        {...props}
      />
      </TableContext.Provider>
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
  ({ className, sticky, children, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(
        sticky && 'sticky top-0 z-10 bg-background',
        className
      )}
      {...props}
    >
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
    className={cn(className)}
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
  ({ className, selected, disabled, clickable, ...props }, ref) => {
    const { variant } = React.useContext(TableContext);
    return (
    <tr
      ref={ref}
      className={cn(
          'border-b transition-colors data-[state=selected]:bg-muted',
          variant === 'bordered' && '[&>th]:border-r [&>td]:border-r',
          selected && 'bg-muted/50',
          disabled && 'opacity-50 pointer-events-none',
          clickable && 'cursor-pointer',
          '[&_tr:last-child]:border-0',
        className
      )}
      {...props}
    />
    );
  }
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
  ({ className, children, sortable, sortDirection, onSort, ...props }, ref) => {
    const { size } = React.useContext(TableContext);
    return (
    <th
      ref={ref}
        className={cn(
          tableCellVariants({ size, align: 'left' }),
          'font-bold text-muted-foreground',
          className
        )}
      {...props}
    >
      <div
        className={cn(
          "flex items-center gap-2", // Лаконичный заголовок
          sortable && "cursor-pointer select-none hover:bg-muted/50 rounded px-1 -mx-1"
        )}
        onClick={sortable ? onSort : undefined}
      >
        {children}
        {/* Индикатор сортировки */}
        {sortable && (
          <div className="flex flex-col">
            <ChevronUp
              className={cn(
                'h-3 w-3 transition-colors',
                sortDirection === 'asc' ? 'text-icambio-primary' : 'text-muted-foreground/50'
              )}
            />
            <ChevronDown
              className={cn(
                'h-3 w-3 -mt-1 transition-colors',
                sortDirection === 'desc' ? 'text-icambio-primary' : 'text-muted-foreground/50'
              )}
            />
          </div>
        )}
      </div>
    </th>
    );
  }
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
const tableCellVariants = cva(
  'align-middle [&:has([role=checkbox])]:pr-0',
  {
    variants: {
      size: {
        sm: 'py-1 px-2',
        md: 'py-2 px-4',
        lg: 'py-3 px-6',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      }
    },
    defaultVariants: {
      size: 'md',
      align: 'left',
    },
  }
);

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align = 'left', numeric, ...props }, ref) => {
    const { size } = React.useContext(TableContext);
    return (
    <td
      ref={ref}
        className={cn(tableCellVariants({ size, align }), numeric && 'font-mono', className)}
      {...props}
    />
    );
  }
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

/**
 * # Полный пример использования
 *
 * ```tsx
 * import {
 *   Table,
 *   TableHeader,
 *   TableBody,
 *   TableHead,
 *   TableRow,
 *   TableCell,
 *   TableCaption,
 * } from '@/shared/ui/Table';
 * import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/shared/ui/Select';
 * import { Button } from '@/shared/ui/Button';
 *
 * interface Rate {
 *   currency: string;
 *   rate: number;
 *   status: 'active' | 'inactive';
 * }
 *
 * const rates: Rate[] = [
 *   { currency: 'USD', rate: 90.15, status: 'active' },
 *   { currency: 'EUR', rate: 98.42, status: 'inactive' },
 *   { currency: 'BTC', rate: 30000, status: 'active' },
 * ];
 *
 * export function RatesTable() {
 *   const [sortDir, setSortDir] = React.useState<'asc' | 'desc' | null>('asc');
 *   const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'inactive'>('all');
 *
 *   const sorted = React.useMemo(() => {
 *     const data = [...rates];
 *     data.sort((a, b) => sortDir === 'asc' ? a.rate - b.rate : b.rate - a.rate);
 *     return data;
 *   }, [sortDir]);
 *
 *   const filtered = sorted.filter(r => statusFilter === 'all' ? true : r.status === statusFilter);
 *
 *   return (
 *     <Table variant="striped" size="md">
 *       <TableCaption>Курсы валют на {new Date().toLocaleDateString()}</TableCaption>
 *       <TableHeader
 *         sticky
 *         showFilters
 *         filtersComponent={
 *           <Select value={statusFilter} onValueChange={val => setStatusFilter(val as any)}>
 *             <SelectTrigger size="sm"><SelectValue placeholder="Статус" /></SelectTrigger>
 *             <SelectContent>
 *               <SelectItem value="all">Все</SelectItem>
 *               <SelectItem value="active">Активные</SelectItem>
 *               <SelectItem value="inactive">Неактивные</SelectItem>
 *             </SelectContent>
 *           </Select>
 *         }
 *       >
 *         <TableRow>
 *           <TableHead>Валюта</TableHead>
 *           <TableHead
 *             sortable
 *             sortDirection={sortDir}
 *             onSort={() => setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')}
 *           >
 *             Курс
 *           </TableHead>
 *           <TableHead>Статус</TableHead>
 *           <TableHead>Действия</TableHead>
 *         </TableRow>
 *       </TableHeader>
 *       <TableBody>
 *         {filtered.map(r => (
 *           <TableRow key={r.currency} clickable onClick={() => alert(r.currency)}>
 *             <TableCell>{r.currency}</TableCell>
 *             <TableCell align="right" numeric>{r.rate.toLocaleString()}</TableCell>
 *             <TableCell>{r.status === 'active' ? 'Активен' : 'Неактивен'}</TableCell>
 *             <TableCell>
 *               <Button size="sm" variant="outline">Подробнее</Button>
 *             </TableCell>
 *           </TableRow>
 *         ))}
 *       </TableBody>
 *     </Table>
 *   );
 * }
 * ```
 */

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
