import React, { useState } from 'react';
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCreateTask } from '../lib/hooks/useTasks';
import { Plus } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the task schema with Zod
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional()
});

type TaskFormValues = z.infer<typeof taskSchema>;

export function TaskForm() {
  const [open, setOpen] = useState(false);
  const [lastFormData, setLastFormData] = useState<TaskFormValues | null>(null);
  const createTask = useCreateTask();
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: lastFormData?.title || '',
      description: lastFormData?.description || ''
    }
  });
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = form;
  
  // Update form when lastFormData changes
  React.useEffect(() => {
    if (lastFormData) {
      setValue('title', lastFormData.title);
      setValue('description', lastFormData.description || '');
    }
  }, [lastFormData, setValue]);
  
  const onSubmit = (data: TaskFormValues) => {
    // Save form data in case we need to reopen on error
    const formData = {
      title: data.title.trim(),
      description: data.description?.trim() || ''
    };
    setLastFormData(formData);
    
    // Close dialog immediately
    setOpen(false);
    
    // Create task with error handling for reopening
    createTask.mutate({ 
      title: formData.title,
      description: formData.description || null
    }, {
      onSuccess: () => {
        // Clear saved form data and reset form fields on success
        setLastFormData(null);
        reset({
          title: '',
          description: ''
        });
        // Display success toast
        toast.success("Task created successfully");
      },
      onError: (error) => {
        console.error('Failed to create task:', error);
        // Reopen dialog with the same data
        setOpen(true);
        // Display error toast
        toast.error("Failed to create task. Please try again.");
      }
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) reset();
    }}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                id="title"
                placeholder="Enter task title"
                className={errors.title ? 'border-red-400 focus-visible:ring-red-300' : ''}
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <textarea 
                id="description"
                placeholder="Enter task description"
                className={`flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${errors.description ? 'border-red-400 focus-visible:ring-red-300' : ''}`}
                rows={3}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>
            
            {createTask.isError && (
              <div className="text-sm text-red-500">
                Failed to create task. Please try again.
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createTask.isPending}
              className="cursor-pointer"
            >
              {createTask.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
