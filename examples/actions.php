<?
header('Content-type: application/json');
http_response_code(400);
$response = [
    'status' => 400,
    'error' => 'common error goes here',
    'errors' => [
        'inputError1' => "error message goes here",
        'inputError2' => "message with one more error"
    ]
];

echo json_encode($response);

?>

