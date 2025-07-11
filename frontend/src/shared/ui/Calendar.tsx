"use client"

import * as React from "react"
import { DayPicker, DropdownProps, type PreviousMonthButtonProps, type NextMonthButtonProps } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select"
import { Button } from "@/shared/ui/Button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

// Кастомный dropdown для месяцев и годов, используя наш Select компонент
function CustomDropdown(props: DropdownProps) {
  const { options, value, onChange } = props

  // Обработчик изменения значения для совместимости с DayPicker API
  const handleValueChange = (newValue: string) => {
    if (onChange) {
      const syntheticEvent = {
        target: {
          value: newValue
        }
      } as React.ChangeEvent<HTMLSelectElement>

      onChange(syntheticEvent)
    }
  }

  return (
    <Select value={value?.toString()} onValueChange={handleValueChange}>
      <SelectTrigger size="sm" className="w-auto min-w-[80px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options?.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value.toString()}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Кастомная кнопка "Предыдущий месяц" используя наш Button компонент
function CustomPreviousMonthButton(props: PreviousMonthButtonProps) {
  const { disabled, onClick, ...buttonProps } = props
  
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-7 w-7"
      onClick={onClick}
      disabled={disabled}
      {...buttonProps}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
  )
}

// Кастомная кнопка "Следующий месяц" используя наш Button компонент  
function CustomNextMonthButton(props: NextMonthButtonProps) {
  const { disabled, onClick, ...buttonProps } = props
  
  return (
    <Button
      variant="outline" 
      size="icon"
      className="h-7 w-7"
      onClick={onClick}
      disabled={disabled}
      {...buttonProps}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = false, // По документации: по умолчанию скрывать дни других месяцев
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout="dropdown" // Caption Dropdown для месяца/года
      navLayout="around" // Navigation Layout: кнопки по бокам от caption
      className={className}
      classNames={{
        // Зеленые стили для выбранных дат
        selected: "bg-green-100 text-green-900 font-semibold hover:bg-green-600 hover:text-white focus:bg-green-600 focus:text-white",
        // Зеленые стили для диапазона дат
        range_start: "bg-green-600 text-white rounded-md",
        range_end: "bg-green-600 text-white rounded-md", 
        range_middle: "bg-green-100 text-green-900 font-semibold",
        // Зеленый стиль для сегодняшней даты
        today: "bg-green-100 text-green-900 rounded-md font-semibold",
        ...classNames,
      }}
      modifiers={{
        // Определяем выходные дни (суббота и воскресенье)
        weekend: { dayOfWeek: [0, 6] },
      }}
      modifiersClassNames={{
        // Стиль для выходных дней
        weekend: "text-red-500",
      }}
      components={{
        // Используем наш кастомный dropdown для месяцев и годов
        Dropdown: CustomDropdown,
        // Используем наши кастомные навигационные кнопки
        PreviousMonthButton: CustomPreviousMonthButton,
        NextMonthButton: CustomNextMonthButton,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

/**
 * @component Calendar
 * @description Компонент для отображения и выбора дат. Является оберткой над react-day-picker
 * с кастомными стилями и компонентами для навигации, которые соответствуют дизайн-системе проекта.
 *
 * @param {CalendarProps} props - Пропсы, которые принимает react-day-picker.
 * @see https://react-day-picker.js.org/api/interfaces/DayPickerProps
 */
export { Calendar }