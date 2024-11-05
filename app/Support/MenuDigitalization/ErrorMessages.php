<?php

namespace App\Support\MenuDigitalization;

class ErrorMessages
{
  public const CODES = [
    // Processing Errors (PROC)
    'PROC_001' => [
      'title' => 'error_processing_menu',
      'message' => 'error_proc_001',
      'details' => 'error_proc_001_details',
      'suggestion' => 'error_proc_001_suggestion'
    ],
    'PROC_002' => [
      'title' => 'error_processing_menu',
      'message' => 'error_proc_002',
      'details' => 'error_proc_002_details',
      'suggestion' => 'error_proc_002_suggestion'
    ],
    'PROC_003' => [
      'title' => 'error_processing_menu',
      'message' => 'error_proc_003',
      'details' => 'error_proc_003_details',
      'suggestion' => 'error_proc_003_suggestion'
    ],
    'PROC_004' => [
      'title' => 'error_processing_menu',
      'message' => 'error_proc_004',
      'details' => 'error_proc_004_details',
      'suggestion' => 'error_proc_004_suggestion'
    ],

    // AI Processing Errors (AI)
    'AI_001' => [
      'title' => 'error_processing_menu',
      'message' => 'error_ai_001',
      'details' => 'error_ai_001_details',
      'suggestion' => 'error_ai_001_suggestion'
    ],
    'AI_002' => [
      'title' => 'error_processing_menu',
      'message' => 'error_ai_002',
      'details' => 'error_ai_002_details',
      'suggestion' => 'error_ai_002_suggestion'
    ],
    'AI_003' => [
      'title' => 'error_processing_menu',
      'message' => 'error_ai_003',
      'details' => 'error_ai_003_details',
      'suggestion' => 'error_ai_003_suggestion'
    ],
    'AI_004' => [
      'title' => 'error_processing_menu',
      'message' => 'error_ai_004',
      'details' => 'error_ai_004_details',
      'suggestion' => 'error_ai_004_suggestion'
    ],

    // System Errors (SYS)
    'SYS_001' => [
      'title' => 'connection_error',
      'message' => 'error_sys_001',
      'details' => 'connection_lost',
      'suggestion' => 'check_connection'
    ],
    'SYS_002' => [
      'title' => 'error_processing_menu',
      'message' => 'error_sys_002',
      'details' => 'error_sys_002_details',
      'suggestion' => 'error_sys_002_suggestion'
    ],
    'SYS_003' => [
      'title' => 'error_processing_menu',
      'message' => 'error_sys_003',
      'details' => 'error_sys_003_details',
      'suggestion' => 'error_sys_003_suggestion'
    ],
    'SYS_004' => [
      'title' => 'error_processing_menu',
      'message' => 'error_sys_004',
      'details' => 'error_sys_004_details',
      'suggestion' => 'error_sys_004_suggestion'
    ],

    // Validation Errors (VAL)
    'VAL_001' => [
      'title' => 'error_processing_menu',
      'message' => 'error_val_001',
      'details' => 'error_val_001_details',
      'suggestion' => 'error_val_001_suggestion'
    ],
    'VAL_002' => [
      'title' => 'error_processing_menu',
      'message' => 'error_val_002',
      'details' => 'error_val_002_details',
      'suggestion' => 'error_val_002_suggestion'
    ],
    'VAL_003' => [
      'title' => 'error_processing_menu',
      'message' => 'error_val_003',
      'details' => 'error_val_003_details',
      'suggestion' => 'error_val_003_suggestion'
    ],
    'VAL_004' => [
      'title' => 'error_processing_menu',
      'message' => 'error_val_004',
      'details' => 'error_val_004_details',
      'suggestion' => 'error_val_004_suggestion'
    ],
  ];

  public static function get(string $code, ?string $additionalInfo = null): array
  {
    $error = self::CODES[$code] ?? self::CODES['SYS_003'];

    return [
      'code' => $code,
      'title_key' => $error['title'],
      'message_key' => $error['message'],
      'details_key' => $error['details'],
      'suggestion_key' => $error['suggestion'],
    ];
  }

  public static function getMessage(string $code): string
  {
    return self::CODES[$code]['message'] ?? self::CODES['SYS_003']['message'];
  }

  public static function getDetails(string $code): string
  {
    return self::CODES[$code]['details'] ?? self::CODES['SYS_003']['details'];
  }
}
