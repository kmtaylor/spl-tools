<!-- wp:paragraph -->
<p><?php echo $config['councilName']; ?></p>
<!-- /wp:paragraph -->

<?php if (isset($media["header.jpg"])): ?>
<!-- wp:image {"id":<?php echo $media["header.jpg"]['id']; ?>,"aspectRatio":"16/9","scale":"cover","sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><img src="<?php echo $media["header.jpg"]['url']; ?>" alt="" class="wp-image-<?php echo $media["header.jpg"]['id']; ?>" style="aspect-ratio:16/9;object-fit:cover"/></figure>
<!-- /wp:image -->
 <?php endif ?>

<?php foreach ($config['wardNames'] as $index => $wardName): ?>
<!-- wp:heading {"level":3,"className":"is-style-default"} -->
<?php $wardSlug = strtolower(str_replace(' ', '-', $wardName)); ?>
<h3 class="wp-block-heading is-style-default" id="<?php echo $wardSlug; ?>"><a style="text-decoration: none;" href="#<?php echo $wardSlug; ?>"><?php echo $wardName; ?></a></h3>
<!-- /wp:heading -->

<?php
$wardCandidates = array_filter($candidates, function ($candidate) use ($wardName) {
    return isset($candidate["Ward"]) && $candidate["Ward"] === $wardName;
});

usort($wardCandidates, function($a, $b) {
    if ($a == $b) {
        return 0;
    }
    return (((int) $a) < ((int) $b)) ? 1 : -1;
});

if (count($wardCandidates) == 0) continue;
?>
<!-- wp:group {"layout":{"type":"grid","columnCount":3}} -->
<div class="wp-block-group">
    <?php foreach ($wardCandidates as $index => $candidate): ?>
    <!-- wp:group {"layout":{"type":"flex","orientation":"vertical","justifyContent":"center"}} -->
    <div class="wp-block-group">
        <?php 
            if (isset($media[$candidate['Picture']])) {
                $candidate_image = $media[$candidate['Picture']];
            } else {
                $candidate_image = $media['default.png'];
            }
        ?>

        <!-- wp:image {"id":<?php echo $candidate_image['id']; ?>,"aspectRatio":"1","scale":"cover","style":{"color":{}}} -->
        <figure class="wp-block-image"><img src="<?php echo $candidate_image['url']; ?>" alt="" class="wp-image-<?php echo $candidate_image['id']; ?>" style="aspect-ratio:1;object-fit:cover"/></figure>
        <!-- /wp:image -->

        <!-- wp:heading {"fontSize":"medium"} -->
        <h2 class="wp-block-heading has-medium-font-size"><strong><?php echo $candidate['Candidate Name']; ?></strong></h2>
        <!-- /wp:heading -->

        <!-- wp:paragraph -->
        <p>Lorem Ipsum</p>
        <!-- /wp:paragraph -->
    </div>
    <!-- /wp:group -->
    <?php endforeach; ?>

</div>
<!-- /wp:group -->
<?php endforeach; ?>