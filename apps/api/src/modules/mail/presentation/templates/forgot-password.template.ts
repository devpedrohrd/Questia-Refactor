export const getForgotPasswordEmailTemplate = (resetUrl: string) => {
  const text = `Olá!\n\nRecebemos uma solicitação para redefinir a senha da sua conta no Questia.\n\nPara criar uma nova senha, acesse o link abaixo:\n${resetUrl}\n\nSe você não solicitou essa redefinição, apenas ignore este e-mail. A sua conta continuará segura.\n\nAtenciosamente,\nEquipe Questia`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Recuperação de Senha - Questia</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    }
    .email-wrapper {
      width: 100%;
      background-color: #f9fafb;
      padding: 40px 0;
    }
    .email-card {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }
    .header {
      background-color: #1e3a8a; /* Indigo-900 */
      padding: 30px 40px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      letter-spacing: 0.5px;
    }
    .body {
      padding: 40px;
      color: #374151; /* Gray-700 */
      line-height: 1.6;
      font-size: 16px;
    }
    .body p {
      margin-bottom: 20px;
    }
    .button-container {
      text-align: center;
      margin: 35px 0;
    }
    .footer {
      background-color: #f3f4f6; /* Gray-100 */
      padding: 24px 40px;
      text-align: center;
      font-size: 13px;
      color: #6b7280; /* Gray-500 */
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-card">
      <div class="header">
        <h1>Questia</h1>
      </div>
      <div class="body">
        <p>Olá,</p>
        <p>Recebemos recentemente uma solicitação para redefinir a senha associada à sua conta no <strong>Questia</strong>.</p>
        <p>Para darmos continuidade e criar uma nova senha de acesso, clique no botão abaixo:</p>
        
        <div class="button-container">
          <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Redefinir minha senha</a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 40px;">
          Se o botão não funcionar, você também pode copiar e colar o seguinte link no seu navegador:<br>
          <a href="${resetUrl}" style="word-break: break-all; color: #2563eb;">${resetUrl}</a>
        </p>
        
        <p>Se você não solicitou esta redefinição de senha, nenhuma ação adicional será necessária. A sua conta continuará protegida e nada será alterado.</p>
        
        <p>Atenciosamente,<br>Equipe de Suporte Questia</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Questia. Todos os direitos reservados.</p>
        <p>Esta é uma mensagem automática, por favor não responda.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `

  return { text, html }
}
