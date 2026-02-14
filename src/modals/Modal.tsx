'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ModalProps {
  open?: boolean;
  onCancel: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number | string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  isLoading?: boolean;
}

export function Modal({
  open = true,
  title,
  description,
  children,
  footer,
  width = 900,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  isLoading = false,
  onCancel,
  onConfirm
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={val => !val && onCancel()}>
      <DialogContent
        className={cn('flex max-h-[calc(100vh-150px)] flex-col gap-0 p-0 sm:max-w-175')}
        style={{ maxWidth: width }}>
        <DialogHeader className='px-6 py-4 border-b'>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className='flex-1 overflow-y-auto px-6 py-4'>{children}</div>

        {(footer || onConfirm) && (
          <DialogFooter className='px-6 py-4 border-t'>
            {footer ? (
              footer
            ) : (
              <div className='flex w-full justify-end gap-2'>
                <Button variant='outline' onClick={onCancel} disabled={isLoading}>
                  {cancelText}
                </Button>
                {onConfirm && (
                  <Button onClick={onConfirm} disabled={isLoading}>
                    {confirmText}
                  </Button>
                )}
              </div>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
