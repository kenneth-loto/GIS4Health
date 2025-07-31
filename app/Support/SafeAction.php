<?php

namespace App\Support;

use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Closure;
use Exception;

class SafeAction
{
    public static function run(
        Closure $callback,
        string $successMsg,
        string $errorMsg,
        ?string $redirect = null,
        ?string $dbErrorMsg = null
    ) {
        try {
            $callback();

            return redirect($redirect ?? url()->previous())
                ->with('success', $successMsg);
        } catch (QueryException $e) {
            Log::error("[DB ERROR] {$errorMsg}: " . $e->getMessage());

            return redirect()->back()
                ->with('error', $dbErrorMsg ?? ($errorMsg . ' (Database error)'));
        } catch (Exception $e) {
            Log::error("[APP ERROR] {$errorMsg}: " . $e->getMessage());

            return redirect()->back()
                ->with('error', $errorMsg);
        }
    }
}
