import { CircularProgress } from '@/Components/CircularProgress';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { AnimatePresence, motion } from 'framer-motion';
import { __ } from 'laravel-translator';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props extends PageProps {
  restaurant: {
    id: number;
    name: string;
  };
  batch: {
    id: string;
    progress: number;
    finished: boolean;
    cancelled: boolean;
    pendingJobs: number;
    failedJobs: number;
    totalJobs: number;
  };
}

interface ProcessingError {
  code: string;
  message: string;
  details?: string;
  suggestion?: string;
  title?: string;
}

interface BatchData {
  status: 'waiting' | 'processing' | 'completed' | 'failed';
  message?: string;
  error?: ProcessingError;
  total_files?: number;
  processed_files?: number;
  files?: {
    name: string;
    status: string;
    error?: ProcessingError;
    results?: {
      detected_items: number;
      confidence_score: number;
      is_likely_menu: boolean;
      menu_data: MenuData;
      sample_items: Array<{
        name: string;
        price: number;
      }>;
    };
  }[];
}

interface MenuItem {
  name: string;
  description: string | null;
  price: number | null;
  tags: string[];
  ingredients: string[];
  notes: string | null;
  image?: {
    detected: boolean;
    coordinates?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}

interface MenuData {
  categories: MenuCategory[];
  currency: string;
  additional_info: {
    dietary_notes: string | null;
    other_notes: string | null;
  };
  confidence_score: number;
}

const ERROR_MESSAGES: Record<string, string> = {
  PROC_001: __('messages.error_proc_001'),
  PROC_002: __('messages.error_proc_002'),
  PROC_003: __('messages.error_proc_003'),
  PROC_004: __('messages.error_proc_004'),
  AI_001: __('messages.error_ai_001'),
  AI_002: __('messages.error_ai_002'),
  AI_003: __('messages.error_ai_003'),
  AI_004: __('messages.error_ai_004'),
  SYS_001: __('messages.error_sys_001'),
  SYS_002: __('messages.error_sys_002'),
  SYS_003: __('messages.error_sys_003'),
  SYS_004: __('messages.error_sys_004'),
  VAL_001: __('messages.error_val_001'),
  VAL_002: __('messages.error_val_002'),
  VAL_003: __('messages.error_val_003'),
  VAL_004: __('messages.error_val_004'),
  DEFAULT: __('messages.error_default'),
};

const getErrorMessage = (error: ProcessingError | undefined): string => {
  if (!error) return ERROR_MESSAGES['DEFAULT'];
  return (
    ERROR_MESSAGES[error.code] || error.message || ERROR_MESSAGES['DEFAULT']
  );
};

const ConfidenceIndicator = ({
  score,
  showProgress = false,
  progress = 0,
}: {
  score: number;
  showProgress?: boolean;
  progress?: number;
}) => {
  const getVariant = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className="relative">
          {showProgress && (
            <div className="absolute inset-0">
              <CircularProgress
                value={progress}
                size="sm"
                variant="default"
                thickness={2}
                showValue={false}
              />
            </div>
          )}
          <CircularProgress
            value={score}
            size="sm"
            variant={getVariant(score)}
            thickness={4}
            className={cn('relative', showProgress && 'z-10')}
          />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">
            {__('messages.confidence_score_info')}
          </h4>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              <span className="font-medium text-green-600">80-100:</span>{' '}
              {__('messages.confidence_high')}
            </p>
            <p className="mb-2">
              <span className="font-medium text-yellow-600">60-79:</span>{' '}
              {__('messages.confidence_medium')}
            </p>
            <p>
              <span className="font-medium text-red-600">&lt;60:</span>{' '}
              {__('messages.confidence_low')}
            </p>
          </div>
          {showProgress && (
            <div className="mt-2 border-t pt-2">
              <p className="text-sm text-muted-foreground">
                {__('messages.processing_progress')}: {progress}%
              </p>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const MenuDataDisplay = ({
  menuData,
  isProcessing,
}: {
  menuData: MenuData;
  isProcessing: boolean;
}) => {
  return (
    <div className="space-y-8">
      {menuData.categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-6">
          <h3 className="text-lg font-medium">{category.name}</h3>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  {__('messages.name')}
                </TableHead>
                <TableHead className="w-[100px] text-right">
                  {__('messages.price')}
                </TableHead>
                <TableHead>{__('messages.description')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {category.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={item.name}
                      onChange={(e) => {
                        // TODO: Implement update logic
                        console.log('Name updated:', e.target.value);
                      }}
                      className="w-full"
                      disabled={isProcessing}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.price || ''}
                      onChange={(e) => {
                        // TODO: Implement update logic
                        console.log('Price updated:', e.target.value);
                      }}
                      className="w-full text-right"
                      disabled={isProcessing}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.description || ''}
                      onChange={(e) => {
                        // TODO: Implement update logic
                        console.log('Description updated:', e.target.value);
                      }}
                      className="w-full"
                      disabled={isProcessing}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}

      {/* Additional Information Section */}
      {(menuData.additional_info.dietary_notes ||
        menuData.additional_info.other_notes) && (
        <div className="rounded-lg border p-4">
          <h4 className="mb-3 font-medium text-gray-900">
            {__('messages.additional_information')}
          </h4>
          <div className="space-y-4">
            {menuData.additional_info.dietary_notes && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {__('messages.dietary_notes')}
                </label>
                <textarea
                  value={menuData.additional_info.dietary_notes}
                  onChange={(e) => {
                    // TODO: Implement update logic
                    console.log('Dietary notes updated:', e.target.value);
                  }}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                  disabled={isProcessing}
                />
              </div>
            )}
            {menuData.additional_info.other_notes && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {__('messages.other_notes')}
                </label>
                <textarea
                  value={menuData.additional_info.other_notes}
                  onChange={(e) => {
                    // TODO: Implement update logic
                    console.log('Other notes updated:', e.target.value);
                  }}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                  disabled={isProcessing}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ErrorDisplay = ({ error }: { error: ProcessingError | undefined }) => (
  <div className="rounded-lg border border-red-200 bg-white p-4">
    <div className="flex items-start space-x-3">
      <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-red-500" />
      <div className="flex-1">
        <h3 className="text-base font-medium text-gray-900">
          {error?.title || __('messages.error_processing_menu')}
        </h3>
        <div className="mt-2 space-y-3">
          <p className="text-sm text-gray-600">{error?.message}</p>
          {error?.details && (
            <div className="rounded-md bg-gray-50 p-3">
              <p className="text-sm text-gray-700">
                {__(`messages.error_${error.code.toLowerCase()}_details`) ||
                  error.details}
              </p>
            </div>
          )}
          {error?.suggestion && (
            <div className="flex items-start space-x-2 rounded-md bg-amber-50 p-3">
              <span className="mt-0.5 text-amber-700">💡</span>
              <div className="text-sm">
                <span className="font-medium text-amber-900">
                  {__('messages.suggestion_tip')}:{' '}
                </span>
                <span className="text-amber-800">
                  {__(
                    `messages.error_${error.code.toLowerCase()}_suggestion`,
                  ) || error.suggestion}
                </span>
              </div>
            </div>
          )}
          {error?.code && (
            <p className="text-xs text-gray-500">
              {__('messages.error_code')}: {error.code}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const renderFileCard = (
  file: BatchData['files'][number],
  index: number,
  isProcessing: boolean,
  progress: number = 0,
) => (
  <Card>
    <CardHeader className="py-3">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">{file.name}</h3>
        </div>
        {file.results && (
          <ConfidenceIndicator
            score={file.results.confidence_score}
            showProgress={isProcessing}
            progress={progress}
          />
        )}
      </motion.div>
    </CardHeader>
    <Separator />
    <CardContent className="py-3">
      <AnimatePresence mode="wait">
        {file.error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ErrorDisplay error={file.error} />
          </motion.div>
        ) : (
          file.results && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MenuDataDisplay
                menuData={file.results.menu_data}
                isProcessing={isProcessing}
              />
            </motion.div>
          )
        )}
      </AnimatePresence>
    </CardContent>
  </Card>
);

const FailedProcesses = ({
  files,
  isProcessing,
  progress,
}: {
  files: BatchData['files'];
  isProcessing: boolean;
  progress: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const failedFiles = files?.filter((file) => file.error) || [];

  if (!failedFiles.length) return null;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-lg border-2 border-red-200 bg-background"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between p-6 hover:bg-muted/50">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="font-medium text-red-700">
            {__('messages.failed_processes')} ({failedFiles.length})
          </span>
        </div>
        <ChevronDownIcon
          className={cn(
            'h-5 w-5 text-red-500 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="divide-y divide-border border-t">
          {failedFiles.map((file, index) => (
            <motion.div
              key={file.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
              }}
              className="p-6"
            >
              {renderFileCard(file, index, isProcessing, progress)}
            </motion.div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default function Processing({ auth, restaurant, batch }: Props) {
  const { toast } = useToast();
  const [batchData, setBatchData] = useState<BatchData>({ status: 'waiting' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(
      route('restaurants.menus.digitalize.status', {
        restaurant: restaurant.id,
        batch: batch.id,
      }),
    );

    eventSource.addEventListener('message', (event) => {
      try {
        const rawData = event.data;
        const parsedData = JSON.parse(rawData);
        setBatchData(parsedData.data || { status: 'waiting' });

        console.log({ parsedData });

        if (
          parsedData.data?.status === 'completed' ||
          parsedData.data?.status === 'failed'
        ) {
          eventSource.close();
          if (parsedData.data?.status === 'completed') {
            toast({
              title: __('messages.success'),
              description: parsedData.data.message,
              duration: 3000,
            });
          }
        }
      } catch (error) {
        console.log({ error });

        setError(__('messages.processing_error'));
        eventSource.close();
      }
    });

    eventSource.addEventListener('error', (e) => {
      console.log({ error });
      setError(__('messages.processing_error'));
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  }, [batch.id]);

  const getStatusMessage = () => {
    switch (batchData.status) {
      case 'waiting':
        return __('messages.waiting_to_start');
      case 'processing':
        return __('messages.processing_files', {
          current: batchData.processed_files,
          total: batchData.total_files,
        });
      case 'completed':
        return __('messages.processing_completed');
      case 'failed':
        return __('messages.processing_failed');
      default:
        return __('messages.processing_please_wait');
    }
  };

  const getProgressValue = () => {
    if (batchData.status === 'waiting') return 0;
    if (batchData.status === 'completed') return 100;
    if (!batchData.total_files || !batchData.processed_files) return 0;

    return Math.round(
      (batchData.processed_files / batchData.total_files) * 100,
    );
  };

  const getStatusIcon = () => {
    switch (batchData.status) {
      case 'waiting':
        return <Clock className="h-8 w-8 text-yellow-500" />;
      case 'processing':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-gray-500" />;
    }
  };

  const getProgressColor = () => {
    switch (batchData.status) {
      case 'waiting':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {__('messages.processing_menu')}
        </h2>
      }
    >
      <Head title={__('messages.processing_menu')} />

      <div className="py-12">
        <div className="space-y-6 sm:px-6 lg:px-8">
          {/* Progress Card - Always visible when processing */}
          <AnimatePresence>
            {(batchData.status === 'waiting' ||
              batchData.status === 'processing') && (
              <motion.div
                initial={{ height: 'auto' }}
                animate={{
                  height: batchData.processed_files ? 'auto' : 'auto',
                }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="sticky top-4 z-10 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {getStatusIcon()}
                      <div className="flex-1">
                        <span className="text-sm font-medium">
                          {getStatusMessage()}
                        </span>
                        <Progress
                          value={getProgressValue()}
                          className={`h-2 ${getProgressColor()}`}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {getProgressValue()}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error States */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ErrorDisplay
                error={{
                  code: 'SYS_001',
                  title: __('messages.connection_error'),
                  message: error,
                  details: __('messages.connection_lost'),
                  suggestion: __('messages.check_connection'),
                }}
              />
            </motion.div>
          )}

          {/* Processed Files */}
          <AnimatePresence>
            {/* Successful files */}
            {batchData.files
              ?.filter((file) => !file.error)
              .map((file, index) => (
                <motion.div
                  key={file.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                  }}
                >
                  {renderFileCard(
                    file,
                    index,
                    batchData.status === 'processing',
                    getProgressValue(),
                  )}
                </motion.div>
              ))}

            {/* Failed files */}
            {batchData.files && batchData.files.some((file) => file.error) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <FailedProcesses
                  files={batchData.files}
                  isProcessing={batchData.status === 'processing'}
                  progress={getProgressValue()}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!error &&
            !batchData.files?.length &&
            batchData.status === 'waiting' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="py-12 text-center"
              >
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {__('messages.waiting_to_start')}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {__('messages.waiting_to_start_description')}
                </p>
              </motion.div>
            )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
