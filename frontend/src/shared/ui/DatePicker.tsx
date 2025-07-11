"use client"

import * as React from "react"
import { format } from "date-fns"
import { ru as dateFnsRu } from "date-fns/locale"
import { ru } from "react-day-picker/locale"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/Button"
import { Calendar } from "@/shared/ui/Calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/Popover"

export interface DatePickerProps {
  value?: Date | DateRange
  onChange?: (value: Date | DateRange | undefined) => void
  placeholder?: string
  onClear?: () => void
  className?: string
  mode?: "single" | "range"
}

/**
 * @component DatePicker
 * @description Отзывчивый и кастомизируемый компонент для выбора даты или диапазона дат.
 *
 * @param {DatePickerProps} props - Пропсы для компонента.
 * @param {Date | DateRange} [props.value] - Текущее выбранное значение (дата или диапазон).
 * @param {(value: Date | DateRange | undefined) => void} [props.onChange] - Функция обратного вызова при изменении значения.
 * @param {string} [props.placeholder="Выберите дату"] - Текст плейсхолдера, когда значение не выбрано.
 * @param {() => void} [props.onClear] - Функция для очистки значения. Если передана, появляется иконка очистки.
 * @param {string} [props.className] - Дополнительные классы для стилизации контейнера.
 * @param {"single" | "range"} [props.mode="single"] - Режим работы: выбор одной даты или диапазона.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = "Выберите дату",
  onClear,
  className,
  mode = "single",
}: DatePickerProps) {
  const isRange = mode === "range"
  const rangeValue = value as DateRange | undefined

  const handleClear = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation()
    onClear?.()
  }

  // Простые обработчики
  const handleSelectSingle = (date: Date | undefined) => {
    onChange?.(date)
  }

  const handleSelectRange = (range: DateRange | undefined) => {
    onChange?.(range)
  }

  // Простое форматирование
  const getDisplayText = () => {
    if (isRange) {
      if (rangeValue?.from) {
        return rangeValue.to
          ? `${format(rangeValue.from, "dd.MM.yyyy", { locale: dateFnsRu })} - ${format(rangeValue.to, "dd.MM.yyyy", { locale: dateFnsRu })}`
          : format(rangeValue.from, "dd.MM.yyyy", { locale: dateFnsRu })
      }
      return placeholder
    }
    return value ? format(value as Date, "dd.MM.yyyy", { locale: dateFnsRu }) : placeholder
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
        className={cn(
            "w-full justify-start text-left font-normal",
          className
        )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {getDisplayText()}
          {value && onClear && (
            <X
              onClick={handleClear}
              className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-sm max-h-[90vh] p-4" align="start">
        {isRange ? (
          <Calendar
            mode="range"
            selected={rangeValue}
            onSelect={handleSelectRange}
            locale={ru}
            defaultMonth={new Date()}
            startMonth={new Date(2021, 0)}
            // endMonth={new Date(2040, 11)}
          />
        ) : (
          <Calendar
            mode="single"
            selected={value as Date | undefined}
            onSelect={handleSelectSingle}
            locale={ru}
            defaultMonth={new Date()}
            startMonth={new Date(2021, 0)}
            // endMonth={new Date(2040, 11)}
          />
                )}
      </PopoverContent>
    </Popover>
  )
}