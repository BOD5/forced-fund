<?php

if (!captcha($_POST['captcha'])) {
    $msg['err'] = "\n Invalid captcha!";
    $msg['field'] = "contact-message";
    $msg['code'] = FALSE;

    echo json_encode($msg);
    exit();
}

// Input
$name = getInput('contact-name');
$phone = getInput('contact-phone');
$email = getInput('contact-email');
$subject = getInput('subject');
$message = getInput('contact-message');

// Validation
if (empty($name)) {
    $msg['err'] = "\n Name can not be empty!";
    $msg['field'] = "contact-name";
} else if (empty($phone)) {
    $msg['err'] = "\n Phone number can not be empty!";
    $msg['field'] = "contact-phone";
} else if (!preg_match("/^[0-9 \\-\\+]{4,17}$/i", $phone)) {
    $msg['err'] = "\n Please put a valid phone number!";
    $msg['field'] = "contact-phone";
} else if (empty($email)) {
    $msg['err'] = "\n Email can not be empty!";
    $msg['field'] = "contact-email";
} else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $msg['err'] = "\n Please put a valid email address!";
    $msg['field'] = "contact-email";
} else if (empty($message)) {
    $msg['err'] = "\n Message can not be empty!";
    $msg['field'] = "contact-message";
} else if (empty($subject)) {
    $msg['err'] = "\n Topic can not be empty!";
    $msg['field'] = "contact-message";
}

if (isset($msg['err'])) {
    $msg['code'] = FALSE;
    echo json_encode($msg);
    exit();
}

// Telegram message
$tgMessage = "<strong>[New message!]</strong>\n\n";
$tgMessage .= "<strong>Name</strong>: $name\n";
$tgMessage .= "<strong>Phone</strong>: $phone\n";
$tgMessage .= "<strong>Email</strong>: $email\n";
$tgMessage .= "<strong>Subject</strong>: $subject\n";
$tgMessage .= "<strong>Message</strong>: $message";

tg($tgMessage);

$msg['success'] = "\n Email has been sent successfully.";
$msg['code'] = TRUE;

echo json_encode($msg);
exit();

// Functions
function tg($message)
{
    $apiBase = 'https://api.telegram.org';
    $bot = '5371573526:AAFOPtnaRn3HFj6BbKYo5JSpwLncNiy1m_A';
    $chatId = '-619416108';

    file_get_contents(
        "$apiBase/bot$bot/sendMessage?chat_id=$chatId&parse_mode=html&text=" . urlencode($message),
        'r'
    );
}

function captcha($captcha) {
    $secret = '6Lf5KMUfAAAAAPczM86UH3bu9BOr_dvcPNAhOWyk';

    $ch = curl_init();

    curl_setopt($ch,CURLOPT_URL, "https://www.google.com/recaptcha/api/siteverify?secret=$secret&response=$captcha&remoteip=" . $_SERVER['REMOTE_ADDR']);
    curl_setopt($ch,CURLOPT_POST, true);

    curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if (empty($response)) {
        return false;
    }

    $responseData = json_decode($response, true);

    if ($responseData['success']) {
        return true;
    }

    return false;
}

function getInput($name) {
    return isset($_POST[$name])
        ? trim(strip_tags($_POST[$name]))
        : '';
}