/*
HOW TO USE
- npm install colors
- npm install figlet
- npm install nodemailer
- npm install fs
- npm install moment
- npm install yesno

RANDOM LIST
- ##email##
- ##blank_1## ( Blank char. 1 is the length )
- ##number_10##
- ##letter_10##
- ##letterup_10##
- ##letterlow_10##
- ##letternumber_10##
- ##letternumberup_10##
- ##letternumberlow_10##
- ##32bit_10## ( 32bit character, such as md5 / sha1 )
*/


exports.send = {
	letter 			: "fide.html", // Letter file
	alt 			: "", // Alternative file
	list 			: "test.txt", // List file

	delay			: 400, // Delay Using miliseconds
	link			: "", // Link ( Usage: ##link## )
	htmlEncoding	: "base64", // utf-8 , hex , base64
	textEncoding	: "", // quoted-printable , base64
	priority		: "", // high , normal , low

	returnPath 		: "info.giscoojobhub@gmail.com", // Return-Path
    messageId		: "", // Custom message id
	useHeader 		: false, // Use header ( true/false )

	emailTest		: "", // Email for test
	testAfter		: 1500, // Test after specific number

	header 			: { // Header value

		"List-Unsubscribe" : "https://##letternumber_10##.com/unsubscribe",
		"X-Mailer" : "Mailchimp Mailer - **CIDe2545d979ebe04e694eb**",
		"X-Campaign": "mailchimp20b0b5e0c9dc3d3c63aca0d82.e2545d979e",
		"X-campaignid": "mailchimp20b0b5e0c9dc3d3c63aca0d82.e2545d979e",
		"X-Report-Abuse": "Please report abuse for this campaign here: https://mailchimp.com/contact/abuse/?u=20b0b5e0c9dc3d3c63aca0d82&id=e2545d979e&e=be04e694eb",
		"X-MC-User": "20b0b5e0c9dc3d3c63aca0d82",
		"X-Feedback-ID": "132017482:132017482.e2545d979e:us4:mc",
	} 
};