import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { XCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: "border-emerald-500/50 text-emerald-700 dark:border-emerald-500 [&>svg]:text-emerald-500",
        info: "border-blue-500/50 text-blue-700 dark:border-blue-500 [&>svg]:text-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AlertProps extends VariantProps<typeof alertVariants> {
  children: React.ReactNode;
  type?: "default" | "destructive" | "success" | "info";
  className?: string;
}

export const Alert = ({ children, type = "default", className }: AlertProps) => {
  const Icon = {
    destructive: XCircle,
    success: CheckCircle,
    info: Info,
    default: AlertTriangle,
  }[type];

  return (
    <div role="alert" className={cn(alertVariants({ variant: type }), className)}>
      {Icon && <Icon className="h-4 w-4" />}
      <div>{children}</div>
    </div>
  );
};
