import 'dotenv/config';
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const BASE_URL = process.env.BASE_URL;

export default function (email) {
  return {
    to: email,
    from: EMAIL_ADDRESS,
    subject: 'Аккаунт создан',
    html: `
      <h1>Вы зарегистрировались на сайте <a href='${BASE_URL}'>KASANIE</a></h1>
    `,
  };
}
