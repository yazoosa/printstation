import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './dialog';
import { Button } from './button';
import { Eye } from 'lucide-react';

interface PreviewProps {
  children: React.ReactNode;
  title?: string;
}

export function Preview({ children, title = 'Details' }: PreviewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle className="text-xl font-semibold mb-4">{title}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}