import 'dotenv/config';
import { Resend } from 'resend';

/**
 * Email service for handling password recovery emails
 */
export class EmailService {
  private resend: Resend;
  private from: string;

  constructor() {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY no está configurado');
    }

    this.resend = new Resend(resendApiKey);
    this.from = process.env.RESEND_FROM || 'Zinema <no-reply@jonmeister.store>';
  }

  /**
   * Send password recovery email
   * @param to - Recipient email address
   * @param resetLink - Password reset link
   */
  async sendRecoveryEmail(to: string, resetLink: string): Promise<void> {
    console.log("Enviando correo (Resend) a:", to);

    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Recuperación de contraseña - Zinema',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">Zinema</h1>
            <p style="color: #666; margin: 5px 0;">Plataforma de Streaming</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Recuperación de contraseña</h2>
            <p style="color: #555; line-height: 1.6;">
              Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Zinema.
            </p>
            <p style="color: #555; line-height: 1.6;">
              Para restablecer tu contraseña, haz clic en el siguiente enlace:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Restablecer Contraseña
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              <strong>Importante:</strong> Este enlace expirará en 1 hora por motivos de seguridad.
            </p>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Si no solicitaste este cambio de contraseña, puedes ignorar este correo de forma segura. 
              Tu cuenta permanecerá protegida.
            </p>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 12px;">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>&copy; 2025 Zinema. Todos los derechos reservados.</p>
          </div>
        </div>
      `
    });

    if (error) {
      throw new Error(`Error al enviar correo con Resend: ${error.message || String(error)}`);
    }

    console.log("Correo enviado exitosamente a:", to);
  }
}

/**
 * Singleton instance
 */
export const emailService = new EmailService();
