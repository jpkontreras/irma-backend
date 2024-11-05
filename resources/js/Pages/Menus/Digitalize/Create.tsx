import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import {
  FileImage,
  FileSpreadsheet,
  FileText,
  Trash2,
  Upload,
} from 'lucide-react';
import { useRef, useState } from 'react';

interface Props extends PageProps {
  restaurant: {
    id: number;
    name: string;
  };
}

type FileType = 'image' | 'pdf' | 'spreadsheet' | 'unknown';

export default function Create({ auth, restaurant }: Props) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data, setData, post, processing, reset } = useForm({
    menu_files: [] as File[],
  });

  const getFileType = (file: File): FileType => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return 'image';
    }
    if (extension === 'pdf') {
      return 'pdf';
    }
    if (['xls', 'xlsx', 'csv'].includes(extension || '')) {
      return 'spreadsheet';
    }
    return 'unknown';
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'image':
        return (
          <FileImage className="h-8 w-8 text-gray-500 dark:text-gray-400" />
        );
      case 'pdf':
        return (
          <FileText className="h-8 w-8 text-gray-500 dark:text-gray-400" />
        );
      case 'spreadsheet':
        return (
          <FileSpreadsheet className="h-8 w-8 text-gray-500 dark:text-gray-400" />
        );
      default:
        return <Upload className="h-8 w-8 text-gray-500 dark:text-gray-400" />;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    const existingSize = data.menu_files.reduce(
      (acc, file) => acc + file.size,
      0,
    );

    if (totalSize + existingSize > 50 * 1024 * 1024) {
      toast({
        title: __('messages.error'),
        description: __('messages.total_files_size_error'),
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    setData('menu_files', [...data.menu_files, ...selectedFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setData(
      'menu_files',
      data.menu_files.filter((_, i) => i !== index),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (data.menu_files.length === 0) {
      setErrors({ menu_files: __('messages.menu_files_required') });
      return;
    }

    post(route('restaurants.menus.digitalize.store', restaurant.id), {
      preserveState: true,
      onSuccess: () => {
        reset('menu_files');
        toast({
          title: __('messages.success'),
          description: __('messages.menu_digitalization_started'),
          duration: 3000,
        });
      },
      onError: (errors) => {
        setErrors(errors);
        toast({
          title: __('messages.error'),
          description: Object.values(errors)[0] as string,
          variant: 'destructive',
          duration: 3000,
        });
      },
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {__('messages.digitalize_menu_for', { restaurant: restaurant.name })}
        </h2>
      }
    >
      <Head title={__('messages.digitalize_menu')} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>{__('messages.digitalize_menu')}</CardTitle>
              <CardDescription>
                {__('messages.digitalize_menu_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="menu_files">
                    {__('messages.upload_menu_files')}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-2">
                    <div className="flex w-full flex-col items-center justify-center gap-4">
                      {/* File List */}
                      {data.menu_files.length > 0 && (
                        <div className="w-full space-y-2">
                          {data.menu_files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between rounded-lg border p-4"
                            >
                              <div className="flex items-center gap-4">
                                {getFileIcon(getFileType(file))}
                                <div>
                                  <p className="text-sm font-medium">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload Area */}
                      <label
                        htmlFor="menu_files"
                        className={`dark:hover:bg-bray-800 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${
                          errors.menu_files
                            ? 'border-red-500 bg-red-50 dark:border-red-800 dark:bg-red-950'
                            : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                          <Upload className="mb-2 h-8 w-8 text-gray-500 dark:text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              {__('messages.click_to_upload')}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {__('messages.supported_file_types')} (PDF, XLS,
                            XLSX, CSV, PNG, JPG, JPEG)
                          </p>
                        </div>
                        <Input
                          id="menu_files"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.gif,.webp"
                          ref={fileInputRef}
                          multiple
                        />
                      </label>

                      {/* Error Message */}
                      {errors.menu_files && (
                        <p className="w-full text-sm text-red-600 dark:text-red-400">
                          {errors.menu_files}
                        </p>
                      )}

                      {/* General File Requirements */}
                      <div className="w-full text-sm text-gray-500 dark:text-gray-400">
                        <p>{__('messages.file_requirements')}</p>
                        <ul className="list-inside list-disc">
                          <li>
                            {__('messages.max_file_size', { size: '10MB' })}
                          </li>
                          <li>
                            {__('messages.total_max_size', { size: '50MB' })}
                          </li>
                          <li>{__('messages.supported_formats')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={processing || data.menu_files.length === 0}
                    className="flex items-center"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {processing
                      ? __('messages.processing')
                      : __('messages.start_digitalization')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
