<?
$msgOpts = [
    'groupTemplate' => '<span class="msg">${message}<button class="btn-close">Close</button></span>'
];
?>
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Demo example</title>
    <link rel="stylesheet" href="../build/sf.css"/>
    <style>
        .js-sf-form {
            width: 480px;
        }
    </style>
</head>
<body>

<h1>Test file</h1>

<form class="js-sf-form" data-messagesOptions='<?= json_encode($msgOpts) ?>'  action="actions.php">
    <label class="item-form">
        <span class="item-label">Input with error</span>
        <input type="text" name="inputError1" value="Input Value" class="item-input"/>
    </label>
    <label class="item-form">
        <span class="item-label">Correct input</span>
        <input type="text" name="inputCorrect" value="Input Value" class="item-input"/>
    </label>
    <label class="item-form">
        <span class="item-label">One more error</span>
        <input type="text" name="inputError2" value="Input Value" class="item-input"/>
    </label>
    <button>Send</button>
</form>

<script type="application/javascript" src="../build/sf.min.js"></script>

</body>
</html>