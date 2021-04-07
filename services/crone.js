import { CronJob } from 'cron';
import fs from 'fs';
import Imap from 'imap';
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: 'tikstudio@mail.ru',
    pass: '$this->helloWorld=1',
  },
})

const job = new CronJob('*/5 * * * * *', () => {
  // transport.sendMail({
  //   from: '"Tigran Muradyan" <tikstudio@mail.ru>',
  //   to: "tigran.inbox@gmail.com",
  //   subject: "Hello",
  //   html: `<b>Hello world? <a href="https://facebook.com">facebook</a></b>`,
  // });
}, null, true);


const imap = new Imap({
  user: 'tikstudio@mail.ru',
  password: '$this->helloWorld=1',
  host: 'imap.mail.ru',
  port: 993,
  tls: true
});
let i = 0

imap.once('ready', () => {
  imap.openBox('INBOX', true, (err, box) => {
    imap.search(['ALL', ['SINCE', 'April 1, 2021']], (r, res) => {
      const f = imap.fetch(res, { bodies: ['HEADER.FIELDS (FROM)', 'TEXT'] });
      f.on('message', (msg) => {
        msg.on('body', (stream, info) => {
          if (info.which === 'TEXT') {
            let count
            let buffer
            stream.on('data', (chunk) => {
              count += chunk.length;
              buffer += chunk.toString('utf8');
            });
            stream.once('end', () => {
              fs.writeFileSync('./' + (i++) + '.html', buffer)
            });
          }
        })
      })
    })
  });
})


imap.once('error', function (err) {
  console.log(err);
});

imap.once('end', function () {
  console.log('Connection ended');
});

imap.connect();
