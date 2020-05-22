<?php
date_default_timezone_set("America/Tegucigalpa");
setlocale(LC_TIME, 'es_HN');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS, post, get');
header("Access-Control-Max-Age", "3600");
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header("Access-Control-Allow-Credentials", "true");
header('Content-Type: application/json');

if (isset($_GET['function'])) {
    $func = $_GET['function'];
    if ($func == 'getCategories') {
        $handle = curl_init();

        $url = "http://190.4.56.14/XploreDeliveryAPI/api/categories/list";
        //$url = "http://localhost/XploreDeliveryAPI/api/categories/list";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        $output = curl_exec($handle);
        return json_encode($output);
        curl_close($handle);
    } else if ($func == 'getTarifas') {
        $handle = curl_init();

        $url = "http://190.4.56.14/XploreDeliveryAPI/api/deliveries/getTarifas";
        //$url = "http://localhost/XploreDeliveryAPI/api/deliveries/getTarifas";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        $output = curl_exec($handle);
        return json_encode($output);
        curl_close($handle);
    }else if ($func == 'getDeliveries') {

        $handle = curl_init();

        $url = "http://190.4.56.14/XploreDeliveryAPI/api/deliveries/list";
        //$url = "http://localhost/XploreDeliveryAPI/api/deliveries/list";


        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        /* set the content type json */

        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);

        return json_encode($output);
    }else if ($func == 'getDeliveryById') {

        $handle = curl_init();

        $url = "http://190.4.56.14/XploreDeliveryAPI/api/deliveries/getById?id=".$_GET['id'];
        //$url = "http://localhost/XploreDeliveryAPI/api/deliveries/getById?id=".$_GET['id'];


        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        /* set the content type json */

        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);

        return json_encode($output);
    }else if ($func == 'listVehicles') {

             $handle = curl_init();

             $url = "http://190.4.56.14/XploreDeliveryAPI/api/vehicles/list";
             //$url = "http://localhost/XploreDeliveryAPI/api/vehicles/list";


             // Set the url
             curl_setopt($handle, CURLOPT_URL, $url);

             /* set the content type json */

             /* set return type json */
             //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

             $output = curl_exec($handle);

             curl_close($handle);

             return json_encode($output);
         }else if ($func == 'listUsers') {

             $handle = curl_init();

             $url = "http://190.4.56.14/XploreDeliveryAPI/api/users/list";
             //$url = "http://localhost/XploreDeliveryAPI/api/users/list";


             // Set the url
             curl_setopt($handle, CURLOPT_URL, $url);

             /* set the content type json */

             /* set return type json */
             //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

             $output = curl_exec($handle);

             curl_close($handle);

             return json_encode($output);
         }else if ($func == 'listStates') {

                  $handle = curl_init();

                  //$url = "http://190.4.56.14/XploreDeliveryAPI/api/deliveries/list";
                  $url = "http://localhost/XploreDeliveryAPI/api/states/list";


                  // Set the url
                  curl_setopt($handle, CURLOPT_URL, $url);

                  /* set the content type json */

                  /* set return type json */
                  //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

                  $output = curl_exec($handle);

                  curl_close($handle);

                  return json_encode($output);
              }
} else if (file_get_contents('php://input')) {
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);
    if ($_POST['function'] == 'insertDelivery') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/XploreDeliveryAPI/api/deliveries/new";
        //$url = "http://localhost/XploreDeliveryAPI/api/deliveries/new";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        /* set the content type json */
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));

        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);
    } else if ($_POST['function'] == 'searchPlace') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "https://calculadoradelivery.xplorerentacar.com/mod.ajax/places.php";



        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $array);
        /* set the content type json */
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:multipart/form-data'));

        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);

        return json_encode($output);
    } else if ($_POST['function'] == 'calculateDistance') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "https://calculadoradelivery.xplorerentacar.com/mod.ajax/distance.php";
        //$url = "http://localhost:8069/XploreDeliveryAPI/public/api/deliveries/new";


        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $array);
        /* set the content type json */
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:multipart/form-data'));

        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);

        return json_encode($output);
    } else if ($_POST['function'] == 'login') {
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/XploreDeliveryAPI/api/auth/login";
        //$url = "http://localhost/XploreDeliveryAPI/api/auth/login";

        // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        /* set the content type json */
        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));

        /* set return type json */
        //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);
    }else if ($_POST['function'] == 'assignDelivery') {
             $post = file_get_contents('php://input');
             $array = json_decode($post);

             $handle = curl_init();
             $authorization = 'Authorization: Bearer '.$_POST['tkn'];

             $url = "http://190.4.56.14/XploreDeliveryAPI/api/deliveries/assign";
             //$url = "http://localhost/XploreDeliveryAPI/api/deliveries/assign";

             // Set the url
             curl_setopt($handle, CURLOPT_URL, $url);
             curl_setopt($handle, CURLOPT_POST, TRUE);
             curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
             /* set the content type json */
             curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', $authorization));

             /* set return type json */
             //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

             $output = curl_exec($handle);

             curl_close($handle);
         }else if ($_POST['function'] == 'finishDelivery') {
                  $post = file_get_contents('php://input');
                  $array = json_decode($post);

                  $handle = curl_init();
                  $authorization = 'Authorization: Bearer '.$_POST['tkn'];

                  //$url = "http://190.4.56.14/XploreDeliveryAPI/api/auth/login";
                  $url = "http://localhost/XploreDeliveryAPI/api/deliveries/finish";

                  // Set the url
                  curl_setopt($handle, CURLOPT_URL, $url);
                  curl_setopt($handle, CURLOPT_POST, TRUE);
                  curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
                  /* set the content type json */
                  curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', $authorization));

                  /* set return type json */
                  //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

                  $output = curl_exec($handle);

                  curl_close($handle);
              }else if ($_POST['function'] == 'changeState') {
                       $post = file_get_contents('php://input');
                       $array = json_decode($post);

                       $handle = curl_init();
                       $authorization = 'Authorization: Bearer '.$_POST['tkn'];

                       //$url = "http://190.4.56.14/XploreDeliveryAPI/api/auth/login";
                       $url = "http://localhost/XploreDeliveryAPI/api/deliveries/changeState";

                       // Set the url
                       curl_setopt($handle, CURLOPT_URL, $url);
                       curl_setopt($handle, CURLOPT_POST, TRUE);
                       curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
                       /* set the content type json */
                       curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json', $authorization));

                       /* set return type json */
                       //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

                       $output = curl_exec($handle);

                       curl_close($handle);
                   }
}

