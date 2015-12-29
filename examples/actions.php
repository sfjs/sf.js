<?
header('Content-type: application/json');
http_response_code(400);
$response = [
    'status' => 400,
    'error' => 'common error goes here',
    'errors' => [
        'inputName' => "error message goes here"
    ]
];

echo json_encode($response);

?>

