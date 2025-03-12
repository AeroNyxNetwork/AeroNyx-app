'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import NodeRegistrationForm from './NodeRegistrationForm';

interface RegisterNodeModalProps {
  trigger?: React.ReactNode;
}

export default function RegisterNodeModal({ trigger }: RegisterNodeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="btn-gradient">
            <PlusCircle className="mr-2 h-4 w-4" />
            Deploy New Node
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="glass-card sm:max-w-[600px] border-white/5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Register Node to SOON Network</DialogTitle>
        </DialogHeader>
        <NodeRegistrationForm 
          onSuccess={() => setIsOpen(false)}
          className="mt-4"
        />
      </DialogContent>
    </Dialog>
  );
}
