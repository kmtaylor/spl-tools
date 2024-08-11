<!-- wp:paragraph -->
<p><?php echo $config['councilName']; ?></p>
<!-- /wp:paragraph -->

<?php if (isset($media["header.jpg"])): ?>
<!-- wp:image {"id":<?php echo $media["header.jpg"]['id']; ?>,"aspectRatio":"16/9","scale":"cover","sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><img src="<?php echo $media["header.jpg"]['url']; ?>" alt="" class="wp-image-<?php echo $media["header.jpg"]['id']; ?>" style="aspect-ratio:16/9;object-fit:cover"/></figure>
<!-- /wp:image -->
 <?php endif ?>

<?php foreach ($config['wardNames'] as $index => $wardName): ?>
<!-- wp:heading {"className":"is-style-default"} -->
<h2 class="wp-block-heading is-style-default" id="<?php echo strtolower(str_replace(' ', '-', $wardName)); ?>"><?php echo $wardName; ?></h2>
<!-- /wp:heading -->

<?php
$wardCandidates = array_filter($candidates, function ($candidate) use ($wardName) {
    return isset($candidate["Ward"]) && $candidate["Ward"] === $wardName;
});

if (count($wardCandidates) == 0) continue;
?>
<!-- wp:group {"layout":{"type":"grid","columnCount":3}} -->
<div class="wp-block-group">
    <?php foreach ($wardCandidates as $index => $candidate): ?>
    <!-- wp:group {"layout":{"type":"flex","orientation":"vertical"}} -->
    <div class="wp-block-group">
        <!-- wp:heading {"fontSize":"medium"} -->
        <h2 class="wp-block-heading has-medium-font-size"><?php echo $candidate['Candidate Name']; ?></h2>
        <!-- /wp:heading -->

        <!-- wp:image {"aspectRatio":"1","scale":"cover","style":{"color":{}}} -->
        <figure class="wp-block-image"><img alt="" style="aspect-ratio:1;object-fit:cover"/></figure>
        <!-- /wp:image -->

        <!-- wp:paragraph -->
        <p>Lorem Ipsum</p>
        <!-- /wp:paragraph -->
    </div>
    <!-- /wp:group -->
    <?php endforeach; ?>

</div>
<!-- /wp:group -->
<?php endforeach; ?>