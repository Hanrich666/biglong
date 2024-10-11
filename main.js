"use strict";
const colors     = require("colors");
const figlet     = require("figlet");
const nodemailer = require("nodemailer");
const fs         = require('fs');
const moment     = require("moment");
const yesno      = require('yesno');
const config     = require("./config.js");

const list       = fs.readFileSync("list.txt").toString().split("\n");
const smtplist   = fs.readFileSync("smtp.txt").toString().split("\n");
const fnameList  = fs.readFileSync("fname.txt").toString().split("\n");
const subjList   = fs.readFileSync("subject.txt").toString().split("\n");
const letter     = fs.readFileSync(config.send.letter, "utf-8");

var staticDate   = moment().format("DDMMYYYY");
let failedSmtp   = [];

// Show banner
console.log("\n");
console.log(
  colors.rainbow(
    figlet.textSync("Pudin Sanjaya", {
      font: "Doom",
      horizontalLayout: "default",
      verticalLayout: "default"
    })
  )
);
console.log(colors.rainbow(" =============================================="));
console.log(colors.brightRed(" +    Special Designed For Random SMTP     +"));
console.log(colors.brightRed(" +   Powered by : PT TWILIO International .Tbk   +"));
console.log(colors.rainbow(" =============================================="));
console.log("\n");

// Fungsi untuk menangani rotasi SMTP yang gagal
function smtpErrorHandling(smtp) {
  failedSmtp.push(smtp);
  smtplist.splice(smtplist.indexOf(smtp), 1);
}

// Fungsi untuk mengirim email
function sending(smtps, email, no, listTotal, retryCount = 0) {
  if (retryCount >= smtplist.length) {
    console.log(` [!] All SMTP retries failed for ${email}`);
    return;
  }

  const smtpDetails = smtps.split(":");

  var smtpConfig = {
    host: smtpDetails[0],
    port: smtpDetails[1],
    secure: false, // true for 465, false for other ports
    auth: {
      user: smtpDetails[2],
      pass: smtpDetails[3]
    },
    fromAddress: smtpDetails[4],
    connectionTimeout: 10000,    // 10 seconds timeout
    greetingTimeout: 10000,      // Timeout for waiting for the greeting after connection (default: 10 seconds)
    socketTimeout: 10000         // Timeout for data sending (default: 10 seconds)
  };

  const transporter = nodemailer.createTransport(smtpConfig);

  // Rotasi From Name dan Subject
  const fromName = fnameList[no % fnameList.length];
  const subject  = subjList[no % subjList.length];

  const message = {
    from: `"${fromName}" <${smtpConfig.fromAddress || smtpConfig.auth.user}>`,
    to: email,
    subject: subject,
    html: letter,
  };

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log(
        ` [+] [${no + 1}/${listTotal}]\n` +
        ` [+] From Name => ${fromName}\n` +
        ` [+] SMTP      => ${smtps}\n` +
        ` [+] Sent To   => ${email}\n` +
        ` [+] Status    => Error: ${error.message}\n` +
        ` [+] Retrying with another SMTP...\n`
      );
      smtpErrorHandling(smtps); // Hapus SMTP yang gagal dan coba yang lain
      // Panggil lagi fungsi sending dengan SMTP berikutnya
      sending(smtplist[retryCount % smtplist.length], email, no, listTotal, retryCount + 1);
    } else {
      console.log(
        ` [+] [${no + 1}/${listTotal}]\n` +
        ` [+] From Name => ${fromName}\n` +
        ` [+] SMTP      => ${smtps}\n` +
        ` [+] Sent To   => ${email}\n` +
        ` [+] Status    => Success\n` +
        ` [+] Delaying for ${config.send.delay} miliseconds...\n`
      );
    }
  });
}

// Fungsi untuk memulai proses pengiriman
async function startsend() {
  if (config.send.emailTest != "" ) {
    if (config.send.testAfter != "") {
      var emailTest = config.send.emailTest;
      var listf = insertAfter(list, emailTest, config.send.testAfter);
    } else {
      var listf = list;
    }
  } else {
    var listf = list;
  }

  console.log(colors.brightCyan(" Send to => " + listf.length + " list"));

  const quest = await yesno({
    question: colors.brightYellow(" Do you want to continue? (y/n)")
  });

  if (!quest) {
    console.log(colors.brightRed("\n Sending cancelled!\n"));
    process.exit();
  } else {
    console.log(colors.brightGreen("\n Start Sending...!\n"));

    var i = 0;

    listf.forEach((email, n) => {
      setTimeout(() => {
        if (smtplist.length > 0) {
          var smtps = smtplist[i % smtplist.length];
          sending(smtps, email, i, listf.length);
          i++;
        } else {
          console.log("All SMTP servers have failed.");
          process.exit();
        }
      }, n * config.send.delay);
    });
  }
}

// Fungsi untuk menyisipkan item setelah elemen tertentu dalam daftar
function insertAfter(arr1, value, afterElement) {
  var result = [];
  for (var i = 1; arr1.length > 0; i++) {
    if (arr1.length > 0) {
      result.push(arr1.shift());
    }
    if (i % afterElement == 0) {
      result.push(value);
    }
  }
  return result;
}

startsend();
