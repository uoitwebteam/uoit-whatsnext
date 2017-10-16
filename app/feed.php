<?php

require_once('inc/functions.php');

$cb = \Codebird\Codebird::getInstance();
$cb->setToken('2767888323-4W8SUuGv9lGEXROMQfCOQIrRjPMFMw834tn6SP4', 'i5mX34FwhDG3ueih6ef3RXxdqvNI4QMEpweQmrvbTbFM6');

$cb->setConnectionTimeout(10000);
$cb->setTimeout(10000);

$params = array('user_id'=>'3319012383','count'=>'15');    
$reply = (array) $cb->statuses_userTimeline($params);

//$data = (array) $reply['statuses'];
$s = 15;//count($reply['statuses']);
$img = '';
$last_img = '';
//print_r(json_encode($reply[0]));

for ($a = 0; $a < $s; $a++) {

    // if (isset($status->retweeted_status) && $status->retweeted_status != null) {

    //     echo $status->user->name . " (@" . $status->user->screen_name . ") retweeted:"; 
    //     echo "<br/>";
    //     $b = $status->retweeted_status;

    // }

    // else {

    $b = $reply[$a];

    // }

    $id = $b->id_str;

    $avatar = $b->user->profile_image_url ? $b->user->profile_image_url : $b->user->profile_image_url_https;
    $user = $b->user->name;
    $handle = $b->user->screen_name;
    $date = $b->created_at;
    $text = $b->text;

    if (isset($b->entities->media[0]) && $b->entities->media[0] != null) {
        $media = $b->entities->media[0];
        $img = $media->media_url ? $media->media_url : $media->media_url_https;
        if ($img != $last_img) {
            $last_img = $img;
            $text = substr_replace($text, '</a>', $media->indices[1], 0);
            $text = substr_replace($text, '<a href="'.$img.'">', $media->indices[0], 0);
        } else {
            $img = '';
        }
        //echo "<br/>" . "<img src=\"" . $media->media_url_https . "\">";
    }
    if (count($b->entities->urls) > 0) {
        foreach ($b->entities->urls as $url) {
            $text = substr_replace($text, '</a>', $url->indices[1], 0);
            $text = substr_replace($text, '<a href="'.$url->expanded_url.'">', $url->indices[0], 0);
        }
    }
    $retweets = $b->retweet_count;
    $favs = $b->favorite_count;

    echo '
    <div class="gridBox animated fadeInUp">
        <div class="avatar">
            <a href="https://twitter.com/statuses/'.$id.'"><img src="'.$avatar.'" alt="'.$user.'\'s profile picture" /></a>
        </div>
        <div class="tweetContent">
            <h3>'.$user.' (@'.$handle.') <small>said on '.date('F j, Y', strtotime($date) ).'</small></h3><h4><small>'.date('g:i a', strtotime($date) ).'</small></h4>
            <p>'.$text.'</p>';
            //echo $img != '' ? '<a href="'.$img.'"><img src="'.$img.'" alt="Picture posted by'.$user.'" /></a>' : '';
            echo '<div class="tweetActivity">';
            echo $retweets > 0 ? '<span class="ion-loop"></span>&nbsp;'.$retweets : '';
            echo $favs > 0 ? '<span class="ion-heart"></span>&nbsp;'.$favs : '';
            echo '</div>';
        echo '
        </div>
    </div>
    ';
}

?>