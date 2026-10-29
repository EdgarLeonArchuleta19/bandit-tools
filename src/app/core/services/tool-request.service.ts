import { Injectable, signal, inject } from '@angular/core';
import { APP_CONSTANTS } from '../constants/app.constants';
import { NotificationService } from './notification.service';
import { TranslationService } from './translation.service';

export interface ToolRequestPayload {
  toolName: string;
  description: string;
  userEmail?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToolRequestService {
  private readonly notificationService = inject(NotificationService);
  private readonly i18n = inject(TranslationService);

  readonly isOpen = signal(false);
  readonly isSubmitting = signal(false);

  openModal(prefillToolName: string = ''): void {
    this.isOpen.set(true);
  }

  closeModal(): void {
    this.isOpen.set(false);
  }

  /**
   * Envía la solicitud directamente al correo del desarrollador.
   * Utiliza FormSubmit (gratuito, sin registro ni servidor backend) con fallback automático a mailto:.
   */
  async submitRequest(payload: ToolRequestPayload): Promise<boolean> {
    this.isSubmitting.set(true);
    const targetEmail = APP_CONSTANTS.feedbackEmail;
    const isEs = this.i18n.currentLang() === 'es';

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `[Bandit Tools] Solicitud de nueva herramienta: ${payload.toolName}`,
          Herramienta: payload.toolName,
          Descripcion: payload.description,
          Email_Contacto: payload.userEmail || 'No proporcionado',
          _template: 'table',
        }),
      });

      if (response.ok) {
        this.notificationService.success(
          isEs
            ? '¡Solicitud enviada con éxito! La revisaremos pronto.'
            : 'Tool request sent successfully! We will review it soon.'
        );
        this.closeModal();
        return true;
      } else {
        throw new Error('Respuesta no exitosa de FormSubmit');
      }
    } catch {
      // Fallback: abrir cliente de correo nativo (100% confiable y sin externos)
      this.sendViaMailto(payload);
      this.notificationService.info(
        isEs
          ? 'Abriendo tu cliente de correo para enviar la solicitud...'
          : 'Opening your email client to send the request...'
      );
      this.closeModal();
      return true;
    } finally {
      this.isSubmitting.set(false);
    }
  }

  sendViaMailto(payload: ToolRequestPayload): void {
    const targetEmail = APP_CONSTANTS.feedbackEmail;
    const subject = encodeURIComponent(`[Bandit Tools] Solicitud: ${payload.toolName}`);
    const body = encodeURIComponent(
      `Hola Bandit Tools,\n\nMe gustaría solicitar una nueva herramienta:\n\n` +
      `• Nombre sugerido: ${payload.toolName}\n` +
      `• Descripción y caso de uso: ${payload.description}\n` +
      `• Mi contacto (opcional): ${payload.userEmail || 'N/A'}\n\n` +
      `¡Gracias!`
    );

    window.open(`mailto:${targetEmail}?subject=${subject}&body=${body}`, '_blank');
  }
}
