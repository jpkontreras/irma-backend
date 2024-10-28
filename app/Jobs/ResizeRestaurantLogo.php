<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Facades\Storage;

class ResizeRestaurantLogo implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  protected $logoPath;

  /**
   * Create a new job instance.
   */
  public function __construct(string $logoPath)
  {
    $this->logoPath = $logoPath;
  }

  /**
   * Execute the job.
   */
  public function handle(): void
  {
    $sizes = [150, 300, 600, 1200];

    $originalImage = Image::read(Storage::disk('public')->path($this->logoPath));

    foreach ($sizes as $size) {
      $resizedImage = clone $originalImage;

      // Resize the image to fit within the square dimensions
      $resizedImage->resize($size, $size, function ($constraint) {
        $constraint->aspectRatio();
        $constraint->upsize();
      });

      // Crop the image to make it square
      $width = $resizedImage->width();
      $height = $resizedImage->height();
      $cropSize = min($width, $height);

      $resizedImage->crop($cropSize, $cropSize);

      $newFilename = pathinfo($this->logoPath, PATHINFO_FILENAME) .
        "_{$size}x{$size}." .
        pathinfo($this->logoPath, PATHINFO_EXTENSION);

      $newPath = dirname($this->logoPath) . '/' . $newFilename;

      Storage::disk('public')->put($newPath, $resizedImage->encode());
    }
  }
}
