<!-- wp:paragraph -->
<p><?php echo $config['councilName']; ?></p>
<!-- /wp:paragraph -->

<?php foreach ($config['wardNames'] as $index => $wardName): ?>
<!-- wp:heading {"className":"is-style-default"} -->
<h2 class="wp-block-heading is-style-default" id="<?php echo strtolower(str_replace(' ', '-', $wardName)); ?>"><?php echo $wardName; ?></h2>
<!-- /wp:heading -->
        
<!-- wp:group {"layout":{"type":"grid"}} -->
<div class="wp-block-group">
    <?php for ($i = 0; $i < 5; $i++): ?>
    <!-- wp:group {"layout":{"type":"flex","orientation":"vertical"}} -->
    <div class="wp-block-group">
        <!-- wp:heading {"fontSize":"medium"} -->
        <h2 class="wp-block-heading has-medium-font-size">Candidate <?php echo $i + 1; ?></h2>
        <!-- /wp:heading -->

        <!-- wp:image {"aspectRatio":"1","scale":"cover","style":{"color":{}}} -->
        <figure class="wp-block-image"><img alt="" style="aspect-ratio:1;object-fit:cover"/></figure>
        <!-- /wp:image -->

        <!-- wp:paragraph -->
        <p>Lorem Ipsum</p>
        <!-- /wp:paragraph -->
    </div>
    <!-- /wp:group -->
    <?php endfor; ?>

</div>
<!-- /wp:group -->
<?php endforeach; ?>