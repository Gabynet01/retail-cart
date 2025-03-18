import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 3000, // Default duration: 3 seconds
    horizontalPosition: 'center',
    verticalPosition: 'top',
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show a snackbar with a message and optional action.
   * @param message - The text to display.
   * @param action - The action button text (optional).
   * @param config - Additional configuration options.
   */
  show(message: string, action: string = 'OK', config: MatSnackBarConfig = {}) {
    this.snackBar.open(message, action, { ...this.defaultConfig, ...config });
  }

  /**
   * Show a success snackbar.
   * @param message - The success message.
   */
  success(message: string) {
    this.show(message, 'OK', { panelClass: 'snackbar-success' });
  }

  /**
   * Show an error snackbar.
   * @param message - The error message.
   */
  error(message: string) {
    this.show(message, 'Dismiss', { panelClass: 'snackbar-error' });
  }

  /**
   * Show an informational snackbar.
   * @param message - The info message.
   */
  info(message: string) {
    this.show(message, 'Got it', { panelClass: 'snackbar-info' });
  }
}
