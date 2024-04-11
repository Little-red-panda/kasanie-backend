import 'dotenv/config';
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const BASE_URL = process.env.BASE_URL;

export default function (email, token) {
  return {
    to: email,
    from: EMAIL_ADDRESS,
    subject: 'Восстановление пароля',
    html: `
      <h1>Забыли пароль?</h1>
      <p>Если нет, проигнорируйте письмо</p>
      <p>Для восстановления пароля нажмите на ссылку ниже:</p>
      <p><a href='${BASE_URL}/auth/password/${token}'>Восстановить пароль</a></p>
    `,
  };
}
